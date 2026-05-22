import { headers } from 'next/headers'
import { stripe, getPlanFromPriceId } from '@/lib/billing'
import { prisma } from '@/lib/prisma'
import type { SubStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

const STATUS_MAP: Record<string, SubStatus> = {
  trialing:   'TRIALING',
  active:     'ACTIVE',
  past_due:   'PAST_DUE',
  canceled:   'CANCELED',
  unpaid:     'UNPAID',
  incomplete: 'PAST_DUE',
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = headers().get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = event.data.object as any

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const priceId   = data.items.data[0]?.price.id as string
      const plan      = getPlanFromPriceId(priceId)
      const stripeStatus = data.status as string

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: data.customer as string },
        data: {
          stripeSubscriptionId: data.id,
          status:               STATUS_MAP[stripeStatus] ?? 'ACTIVE',
          planTier:             plan.tier,
          workspaceLimit:       plan.limit,
          currentPeriodStart:   new Date((data.current_period_start as number) * 1000),
          currentPeriodEnd:     new Date((data.current_period_end   as number) * 1000),
          cancelAtPeriodEnd:    data.cancel_at_period_end as boolean,
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: data.customer as string },
        data:  { status: 'CANCELED' },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
