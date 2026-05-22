'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { canCreateWorkspace } from '@/lib/billing'

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)
}

async function uniqueSlug(base: string) {
  let slug = base, i = 0
  while (await prisma.workspace.findUnique({ where: { slug } })) slug = `${base}-${++i}`
  return slug
}

export async function createWorkspace(data: {
  name:         string
  clientEmail?: string
  businessType?: string
  jurisdiction?: string[]
  websiteUrl?:  string
}): Promise<{ error?: string; workspaceId?: string }> {
  const { orgId } = await auth()
  if (!orgId) return { error: 'Not authenticated' }

  const org = await prisma.organization.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return { error: 'Organisation not found. Please create an organisation in your account settings.' }

  const ok = await canCreateWorkspace(org.id)
  if (!ok) return { error: 'Workspace limit reached for your current plan. Please upgrade to add more clients.' }

  if (!data.name.trim()) return { error: 'Client name is required' }

  const slug = await uniqueSlug(toSlug(data.name))

  const workspace = await prisma.workspace.create({
    data: {
      organizationId: org.id,
      name:           data.name.trim(),
      slug,
      clientEmail:    data.clientEmail?.trim() || null,
      businessType:   data.businessType || null,
      jurisdiction:   data.jurisdiction ?? [],
      websiteUrl:     data.websiteUrl?.trim() || null,
      onboardingSession: { create: { currentStep: 1, status: 'IN_PROGRESS' } },
    },
  })

  return { workspaceId: workspace.id }
}

export async function archiveWorkspace(workspaceId: string): Promise<{ error?: string }> {
  const { orgId } = await auth()
  if (!orgId) return { error: 'Not authenticated' }

  const org = await prisma.organization.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return { error: 'Organisation not found' }

  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } })
  if (!workspace || workspace.organizationId !== org.id) return { error: 'Not found' }

  await prisma.workspace.update({ where: { id: workspaceId }, data: { status: 'ARCHIVED' } })
  return {}
}
