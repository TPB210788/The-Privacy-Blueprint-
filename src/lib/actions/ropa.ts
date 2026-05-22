'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { LegalBasis, ControllerRole, ActivityStatus } from '@prisma/client'

async function assertOrgOwnsWorkspace(workspaceId: string) {
  const { orgId } = await auth()
  if (!orgId) throw new Error('Not authenticated')
  const org = await prisma.organization.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) throw new Error('Organisation not found')
  const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } })
  if (!ws || ws.organizationId !== org.id) throw new Error('Forbidden')
  return org
}

export async function listActivities(workspaceId: string) {
  await assertOrgOwnsWorkspace(workspaceId)
  return prisma.processingActivity.findMany({
    where:   { workspaceId, status: { not: 'ARCHIVED' } },
    orderBy: { createdAt: 'asc' },
  })
}

export async function upsertActivity(
  workspaceId: string,
  data: {
    id?: string
    name: string
    purpose?: string
    legalBasis?: LegalBasis | ''
    legalBasisNotes?: string
    dataSubjectCategories?: string[]
    personalDataCategories?: string[]
    sensitiveDataCategories?: string[]
    recipients?: string[]
    internationalTransfers?: boolean
    transferCountries?: string[]
    transferSafeguards?: string
    retentionPeriod?: string
    deletionProcess?: string
    securityMeasures?: string
    controllerDesignation?: ControllerRole | ''
    status?: ActivityStatus
    lastReviewedAt?: string | null
    nextReviewAt?: string | null
  },
) {
  await assertOrgOwnsWorkspace(workspaceId)

  const payload = {
    name:                   data.name.trim(),
    purpose:                data.purpose?.trim() || null,
    legalBasis:             (data.legalBasis || null) as LegalBasis | null,
    legalBasisNotes:        data.legalBasisNotes?.trim() || null,
    dataSubjectCategories:  data.dataSubjectCategories  ?? [],
    personalDataCategories: data.personalDataCategories ?? [],
    sensitiveDataCategories: data.sensitiveDataCategories ?? [],
    recipients:             data.recipients ?? [],
    internationalTransfers: data.internationalTransfers ?? false,
    transferCountries:      data.transferCountries ?? [],
    transferSafeguards:     data.transferSafeguards?.trim() || null,
    retentionPeriod:        data.retentionPeriod?.trim() || null,
    deletionProcess:        data.deletionProcess?.trim() || null,
    securityMeasures:       data.securityMeasures?.trim() || null,
    controllerDesignation:  (data.controllerDesignation || null) as ControllerRole | null,
    status:                 (data.status ?? 'ACTIVE') as ActivityStatus,
    lastReviewedAt:         data.lastReviewedAt ? new Date(data.lastReviewedAt) : null,
    nextReviewAt:           data.nextReviewAt   ? new Date(data.nextReviewAt)   : null,
  }

  const result = data.id
    ? await prisma.processingActivity.update({ where: { id: data.id }, data: payload })
    : await prisma.processingActivity.create({ data: { workspaceId, ...payload } })

  revalidatePath(`/workspace/${workspaceId}/ropa`)
  return result
}

export async function archiveActivity(workspaceId: string, activityId: string) {
  await assertOrgOwnsWorkspace(workspaceId)
  await prisma.processingActivity.update({
    where: { id: activityId },
    data:  { status: 'ARCHIVED' },
  })
  revalidatePath(`/workspace/${workspaceId}/ropa`)
}

export async function markActivityReviewed(workspaceId: string, activityId: string) {
  await assertOrgOwnsWorkspace(workspaceId)
  await prisma.processingActivity.update({
    where: { id: activityId },
    data:  { lastReviewedAt: new Date(), status: 'ACTIVE' },
  })
  revalidatePath(`/workspace/${workspaceId}/ropa`)
}
