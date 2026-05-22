import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import type { Organization, Workspace, User, OrgRole } from '@prisma/client'

// ── Get or create the current user in our DB ──────────────

export async function getAuthUser(): Promise<User> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (existing) return existing

  // Webhook may not have fired yet — create on demand
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
      avatarUrl: clerkUser.imageUrl || null,
    },
  })
}

// ── Get the current org from Clerk + DB ───────────────────

export async function getAuthOrg(): Promise<
  (Organization & { billing: { planTier: string; workspaceLimit: number; status: string } | null }) | null
> {
  const { orgId } = await auth()
  if (!orgId) return null

  return prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: {
      billing: { select: { planTier: true, workspaceLimit: true, status: true } },
    },
  })
}

// ── Validate access to a workspace ────────────────────────
// Returns { user, org, workspace } or redirects.

export async function validateWorkspaceAccess(
  workspaceId: string,
  requiredRole: WorkspaceRole = 'VIEWER',
): Promise<{ user: User; org: Organization; workspace: Workspace }> {
  const [user, { orgId }] = await Promise.all([getAuthUser(), auth()])
  if (!orgId) redirect('/sign-in')

  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { memberships: { where: { userId: user.id } } },
  })
  if (!org) redirect('/agency')

  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } })
  if (!workspace || workspace.organizationId !== org.id || workspace.status === 'ARCHIVED') {
    redirect('/agency')
  }

  // Owners and admins access all workspaces in their org
  const orgRole = (org as any).memberships[0]?.role as OrgRole | undefined
  if (orgRole === 'OWNER' || orgRole === 'ADMIN') {
    return { user, org, workspace }
  }

  // Members need explicit workspace access
  const wm = await prisma.workspaceMembership.findUnique({
    where: { userId_workspaceId: { userId: user.id, workspaceId } },
  })
  if (!wm) redirect('/agency')
  if (requiredRole === 'ADMIN' && wm.role !== 'ADMIN') redirect(`/workspace/${workspaceId}`)

  return { user, org, workspace }
}

type WorkspaceRole = 'ADMIN' | 'VIEWER'
