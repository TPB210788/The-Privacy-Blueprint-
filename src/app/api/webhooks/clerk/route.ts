import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook secret not configured', { status: 500 })

  const headerPayload = headers()
  const svixId        = headerPayload.get('svix-id')
  const svixTs        = headerPayload.get('svix-timestamp')
  const svixSig       = headerPayload.get('svix-signature')
  if (!svixId || !svixTs || !svixSig) return new Response('Missing svix headers', { status: 400 })

  const body = await req.text()
  const wh = new Webhook(secret)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, { 'svix-id': svixId, 'svix-timestamp': svixTs, 'svix-signature': svixSig }) as WebhookEvent
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  const { type, data } = evt

  switch (type) {
    case 'user.created':
    case 'user.updated': {
      await prisma.user.upsert({
        where:  { clerkId: data.id },
        update: {
          email:     data.email_addresses[0]?.email_address ?? '',
          name:      [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
          avatarUrl: data.image_url || null,
        },
        create: {
          clerkId:   data.id,
          email:     data.email_addresses[0]?.email_address ?? '',
          name:      [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
          avatarUrl: data.image_url || null,
        },
      })
      break
    }

    case 'user.deleted': {
      if (data.id) await prisma.user.deleteMany({ where: { clerkId: data.id } })
      break
    }

    case 'organization.created':
    case 'organization.updated': {
      await prisma.organization.upsert({
        where:  { clerkOrgId: data.id },
        update: { name: data.name, logoUrl: data.image_url || null },
        create: { clerkOrgId: data.id, name: data.name, type: 'AGENCY', logoUrl: data.image_url || null },
      })
      break
    }

    case 'organization.deleted': {
      if (data.id) await prisma.organization.deleteMany({ where: { clerkOrgId: data.id } })
      break
    }

    case 'organizationMembership.created': {
      const [user, org] = await Promise.all([
        prisma.user.findUnique({ where: { clerkId: data.public_user_data.user_id } }),
        prisma.organization.findUnique({ where: { clerkOrgId: data.organization.id } }),
      ])
      if (user && org) {
        const role = data.role === 'org:admin' ? 'OWNER' : 'MEMBER'
        await prisma.organizationMembership.upsert({
          where:  { userId_organizationId: { userId: user.id, organizationId: org.id } },
          update: { role },
          create: { userId: user.id, organizationId: org.id, role },
        })
      }
      break
    }

    case 'organizationMembership.deleted': {
      const [user, org] = await Promise.all([
        prisma.user.findUnique({ where: { clerkId: data.public_user_data.user_id } }),
        prisma.organization.findUnique({ where: { clerkOrgId: data.organization.id } }),
      ])
      if (user && org) {
        await prisma.organizationMembership.deleteMany({
          where: { userId: user.id, organizationId: org.id },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
