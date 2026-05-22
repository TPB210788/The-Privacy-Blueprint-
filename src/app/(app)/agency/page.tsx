import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthOrg } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ClientCard from '@/components/agency/ClientCard'

export default async function AgencyDashboard() {
  const org = await getAuthOrg()
  if (!org) redirect('/sign-in')

  const workspaces = await prisma.workspace.findMany({
    where:   { organizationId: org.id, isAgencyOwn: false, status: 'ACTIVE' },
    include: {
      complianceChecklist:  { select: { score: true } },
      processingActivities: {
        where:   { status: 'ACTIVE' },
        orderBy: { updatedAt: 'desc' },
        take:    1,
        select:  { updatedAt: true },
      },
      _count: {
        select: {
          dsrRequests:          { where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } },
          dpias:                { where: { status: { in: ['DRAFT', 'IN_REVIEW'] } } },
          processingActivities: { where: { status: 'ACTIVE' } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const totalClients = workspaces.length
  const avgScore = totalClients > 0
    ? Math.round(workspaces.reduce((s, w) => s + (w.complianceChecklist?.score ?? 0), 0) / totalClients)
    : 0
  const totalDSRs  = workspaces.reduce((s, w) => s + w._count.dsrRequests, 0)
  const totalDPIAs = workspaces.reduce((s, w) => s + w._count.dpias, 0)

  return (
    <div className="p-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-2xl" style={{ color: '#2C2C2C' }}>Client Workspaces</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(44,44,44,0.5)' }}>
            {totalClients} active {totalClients === 1 ? 'client' : 'clients'}
          </p>
        </div>
        <Link
          href="/agency/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors"
          style={{ backgroundColor: '#8B7355', color: '#fff' }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
            <path d="M4.75 4.75V0h1.5v4.75H11v1.5H6.25V11h-1.5V6.25H0v-1.5h4.75Z" />
          </svg>
          Add Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clients',       value: totalClients, alert: false },
          { label: 'Avg Compliance Score',value: `${avgScore}%`, alert: false },
          { label: 'Open DSRs',           value: totalDSRs,    alert: totalDSRs > 0 },
          { label: 'Open DPIAs',          value: totalDPIAs,   alert: false },
        ].map(({ label, value, alert }) => (
          <div
            key={label}
            className="rounded-lg border p-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(139,115,85,0.15)' }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(44,44,44,0.5)' }}>{label}</p>
            <p className="text-2xl font-playfair" style={{ color: alert ? '#d97706' : '#2C2C2C' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Client grid */}
      {totalClients === 0 ? (
        <div className="text-center py-24">
          <p className="font-playfair text-xl mb-2" style={{ color: '#2C2C2C' }}>No clients yet</p>
          <p className="text-sm mb-6" style={{ color: 'rgba(44,44,44,0.5)' }}>
            Add your first client workspace to start managing their compliance.
          </p>
          <Link
            href="/agency/clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded"
            style={{ backgroundColor: '#8B7355', color: '#fff' }}
          >
            Add First Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workspaces.map(w => (
            <ClientCard key={w.id} workspace={w} />
          ))}
        </div>
      )}
    </div>
  )
}
