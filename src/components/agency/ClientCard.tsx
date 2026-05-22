import Link from 'next/link'

interface ClientCardProps {
  workspace: {
    id:           string
    name:         string
    businessType: string | null
    complianceChecklist: { score: number } | null
    _count: {
      dsrRequests: number
      dpias:       number
      processingActivities: number
    }
    processingActivities: { updatedAt: Date }[]
  }
}

function statusFromScore(score: number | null | undefined) {
  if (score == null) return { label: 'Not started', color: 'gray' }
  if (score >= 75)   return { label: 'Compliant',      color: 'green' }
  if (score >= 50)   return { label: 'At risk',         color: 'amber' }
  return               { label: 'Action needed',  color: 'red' }
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d)
}

const BADGE: Record<string, string> = {
  green: 'bg-green-50 text-green-700 border-green-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red:   'bg-red-50   text-red-600   border-red-200',
  gray:  'bg-gray-50  text-gray-600  border-gray-200',
}

const BAR: Record<string, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red:   'bg-red-400',
  gray:  'bg-gray-300',
}

export default function ClientCard({ workspace }: ClientCardProps) {
  const score   = workspace.complianceChecklist?.score ?? null
  const status  = statusFromScore(score)
  const openDSR = workspace._count.dsrRequests
  const openDPIA = workspace._count.dpias
  const ropaLast = workspace.processingActivities[0]?.updatedAt

  return (
    <div
      className="flex flex-col rounded-lg border overflow-hidden transition-colors hover:border-brown"
      style={{ backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(139,115,85,0.15)' }}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-playfair text-base font-semibold" style={{ color: '#2C2C2C' }}>
              {workspace.name}
            </h3>
            {workspace.businessType && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(44,44,44,0.45)' }}>
                {workspace.businessType}
              </p>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded border whitespace-nowrap ${BADGE[status.color]}`}>
            {status.label}
          </span>
        </div>

        {/* Score bar */}
        {score != null ? (
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(44,44,44,0.5)' }}>
              <span>Compliance score</span>
              <span className="font-medium" style={{ color: '#2C2C2C' }}>{score}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(139,115,85,0.1)' }}>
              <div className={`h-full rounded-full ${BAR[status.color]}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'rgba(44,44,44,0.4)' }}>Onboarding not completed</p>
        )}
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ borderTop: '1px solid rgba(139,115,85,0.1)', borderColor: 'rgba(139,115,85,0.1)' }}
      >
        {[
          { label: 'Open DSRs',  value: openDSR,  alert: openDSR > 0 },
          { label: 'Open DPIAs', value: openDPIA,  alert: false },
          { label: 'ROPA updated', value: ropaLast ? fmtDate(ropaLast) : '—', alert: false },
        ].map(({ label, value, alert }) => (
          <div key={label} className="px-3 py-3 text-center" style={{ borderColor: 'rgba(139,115,85,0.1)' }}>
            <p className="text-xs mb-0.5" style={{ color: 'rgba(44,44,44,0.45)' }}>{label}</p>
            <p
              className="text-sm font-medium"
              style={{ color: alert ? '#d97706' : '#2C2C2C' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 pt-3" style={{ borderTop: '1px solid rgba(139,115,85,0.1)' }}>
        <Link
          href={`/workspace/${workspace.id}`}
          className="block w-full text-center text-sm py-1.5 rounded border transition-colors"
          style={{ borderColor: 'rgba(139,115,85,0.25)', color: '#8B7355' }}
        >
          Open Workspace →
        </Link>
      </div>
    </div>
  )
}
