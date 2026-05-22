import Stripe from 'stripe'
import { prisma } from './prisma'
import type { PlanTier } from '@prisma/client'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const WORKSPACE_LIMITS: Record<PlanTier, number> = {
  BUSINESS_STARTER: 1,
  AGENCY_STARTER: 5,
  AGENCY_GROWTH: 20,
  AGENCY_SCALE: -1,
}

export const PLAN_LABEL: Record<PlanTier, string> = {
  BUSINESS_STARTER: 'Business',
  AGENCY_STARTER: 'Agency Starter (5 clients)',
  AGENCY_GROWTH: 'Agency Growth (20 clients)',
  AGENCY_SCALE: 'Agency Scale (unlimited)',
}

// Map Stripe Price IDs → our plan tiers
export function getPlanFromPriceId(priceId: string): { tier: PlanTier; limit: number } {
  const map: Record<string, { tier: PlanTier; limit: number }> = {
    [process.env.STRIPE_PRICE_BUSINESS_STARTER ?? '']: { tier: 'BUSINESS_STARTER', limit: 1 },
    [process.env.STRIPE_PRICE_AGENCY_STARTER ?? '']:   { tier: 'AGENCY_STARTER',   limit: 5 },
    [process.env.STRIPE_PRICE_AGENCY_GROWTH ?? '']:    { tier: 'AGENCY_GROWTH',    limit: 20 },
    [process.env.STRIPE_PRICE_AGENCY_SCALE ?? '']:     { tier: 'AGENCY_SCALE',     limit: -1 },
  }
  return map[priceId] ?? { tier: 'AGENCY_STARTER', limit: 5 }
}

// Check whether the org can create another workspace
export async function canCreateWorkspace(organizationId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({ where: { organizationId } })

  // No subscription yet — allow up to 1 workspace (trial)
  if (!sub) {
    const count = await prisma.workspace.count({
      where: { organizationId, status: 'ACTIVE' },
    })
    return count < 1
  }

  if (sub.status === 'CANCELED') return false
  if (sub.workspaceLimit === -1) return true

  const count = await prisma.workspace.count({
    where: { organizationId, status: 'ACTIVE' },
  })
  return count < sub.workspaceLimit
}

// Get or create a Stripe customer for an org
export async function getOrCreateStripeCustomer(
  organizationId: string,
  email: string,
  name: string,
): Promise<string> {
  const existing = await prisma.subscription.findUnique({ where: { organizationId } })
  if (existing?.stripeCustomerId) return existing.stripeCustomerId

  const customer = await stripe.customers.create({ email, name })

  await prisma.subscription.create({
    data: {
      organizationId,
      stripeCustomerId: customer.id,
      planTier: 'AGENCY_STARTER',
      status: 'TRIALING',
      workspaceLimit: 5,
    },
  })

  return customer.id
}
