import Link from 'next/link'
import { validateWorkspaceAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isOverdue } from '@/lib/utils'

export default async function WorkspaceDashboard({ params }: { params: { workspaceId: string } }) {
  const { workspace } = await validateWorkspaceAccess(params.workspaceId)
  const wid = workspace.id

  const [checklist, openDSRs, openDPIAs, missingDPAs, activities] = await Promise.all([
    prisma.complianceChecklist.findUnique({ where: { workspaceId: wid } }),
    prisma.dsrRequest.count({ where: { workspaceId: wid, status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
    prisma.dpia.count({ where: { workspaceId: wid, status: { in: ['DRAFT', 'IN_REVIEW'] } } }),
    prisma.vendor.count({ where: { workspaceId: wid, dpaStatus: 'NOT_IN_PLACE' } }),
    prisma.processingActivity.findMany({
      where:  { workspaceId: wid, status: 'ACTIVE' },
      select: { id: true, name: true, lastReviewedAt: true },
    }),
  ])

  const score   = checklist?.score ?? null
  const overdue = activities.filter(a => a.lastReviewedAt && isOverdue(a.lastReviewedAt.toISOString().split('T')[0]))

  const scoreColor = score == null ? '#9ca3af' : score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626'
  const scoreLabel = score == null ? '—' : `${score}%`
  const scoreDesc  = score == null
    ? 'Complete onboarding to calculate your compliance score.'
    : score >= 75 ? 'Your compliance posture is strong.'
    : score >= 50 ? 'Some areas need attention.'
    : 'Action required on several compliance areas.'

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <div className="mb-8">
        <h1 className="font-playfair text-2xl" style={{ color: '#2C2C2C' }}>{workspace.name}</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(44,44,44,0.5)' }}>Compliance overview</p>
      </div>

      {/* Score */}
      <div
        className="rounded-lg border p-6 mb-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(139,115,85,0.15)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-playfair text-lg" style={{ color: '#2C2C2C' }}>Compliance Score</h2>
          <span className="text-3xl font-playfair" style={{ color: scoreColor }}>{scoreLabel}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'rgba(139,115,85,0.1)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score ?? 0}%`, backgroundColor: scoreColor }}
          />
        </div>
        <p className="text-xs" style={{ color: 'rgba(44,44,44,0.5)' }}>{scoreDesc}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'ROPA Activities', value: activities.length, href: `/workspace/${wid}/ropa`, alert: false },
          { label: 'Open DSRs',       value: openDSRs,          href: `/workspace/${wid}/dsr`,     alert: openDSRs > 0 },
          { label: 'Open DPIAs',      value: openDPIAs,         href: `/workspace/${wid}/dpia`,    alert: false },
          { label: 'Missing DPAs',    value: missingDPAs,       href: `/workspace/${wid}/vendors`, alert: missingDPAs > 0 },
        ].map(({ label, value, href, alert }) => (
          <Link
            key={label} href={href}
            className="rounded-lg border p-4 block transition-colors hover:border-brown"
            style={{ backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(139,115,85,0.15)' }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(44,44,44,0.5)' }}>{label}</p>
            <p className="text-2xl font-playfair" style={{ color: alert && value > 0 ? '#d97706' : '#2C2C2C' }}>{value}</p>
          </Link>
        ))}
      </div>

      {/* Overdue ROPA warning */}
      {overdue.length > 0 && (
        <div className="rounded-lg border p-4 mb-6" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
          <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#92400e' }}>
            {overdue.length} ROPA {overdue.length === 1 ? 'activity' : 'activities'} overdue for review
          </h3>
          <div className="space-y-0.5 mb-2">
            {overdue.slice(0, 3).map(a => (
              <p key={a.id} className="text-xs" style={{ color: '#b45309' }}>• {a.name}</p>
            ))}
            {overdue.length > 3 && (
              <p className="text-xs" style={{ color: '#b45309' }}>+ {overdue.length - 3} more</p>
            )}
          </div>
          <Link href={`/workspace/${wid}/ropa`} className="text-xs underline" style={{ color: '#92400e' }}>
            Review in ROPA →
          </Link>
        </div>
      )}

      {/* Feature links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: `/workspace/${wid}/ropa`, title: 'ROPA', desc: 'Record of processing activities', live: true },
          { href: '#', title: 'DPIAs',        desc: 'Data Protection Impact Assessments', live: false },
          { href: '#', title: 'DSR Inbox',    desc: 'Data subject requests',              live: false },
          { href: '#', title: 'Vendors',      desc: 'Vendor register and assessments',    live: false },
          { href: '#', title: 'Data Assets',  desc: 'Data asset register and flow map',   live: false },
          { href: '#', title: 'Reports',      desc: 'Monthly compliance reports',         live: false },
        ].map(({ href, title, desc, live }) => {
          const inner = (
            <div
              className="rounded-lg border p-4 h-full transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                borderColor:     'rgba(139,115,85,0.15)',
                opacity: live ? 1 : 0.6,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium" style={{ color: '#2C2C2C' }}>{title}</h3>
                {!live && (
                  <span className="text-xs rounded border px-1.5 py-0.5" style={{ color: 'rgba(44,44,44,0.35)', borderColor: 'rgba(44,44,44,0.2)' }}>
                    Soon
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: 'rgba(44,44,44,0.5)' }}>{desc}</p>
            </div>
          )
          return live
            ? <Link key={title} href={href} className="block">{inner}</Link>
            : <div key={title}>{inner}</div>
        })}
      </div>
    </div>
  )
}
