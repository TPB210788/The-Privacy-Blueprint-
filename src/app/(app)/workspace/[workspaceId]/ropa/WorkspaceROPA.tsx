'use client'

import { useState, useTransition } from 'react'
import type { ProcessingActivity } from '@prisma/client'
import { upsertActivity, archiveActivity, markActivityReviewed } from '@/lib/actions/ropa'
import { isOverdue, formatDate } from '@/lib/utils'
import WorkspaceActivityModal from './WorkspaceActivityModal'

interface Props {
  workspaceId:        string
  workspaceName:      string
  initialActivities:  ProcessingActivity[]
}

type View = 'table' | 'card'

export default function WorkspaceROPA({ workspaceId, workspaceName, initialActivities }: Props) {
  const [activities, setActivities]         = useState(initialActivities)
  const [view, setView]                     = useState<View>('table')
  const [editing, setEditing]               = useState<ProcessingActivity | null>(null)
  const [adding, setAdding]                 = useState(false)
  const [deletingId, setDeletingId]         = useState<string | null>(null)
  const [pending, startTransition]          = useTransition()

  // Refresh list from server after mutations
  function refresh(updated: ProcessingActivity) {
    setActivities(prev => {
      const idx = prev.findIndex(a => a.id === updated.id)
      return idx >= 0 ? prev.map((a, i) => i === idx ? updated : a) : [...prev, updated]
    })
  }

  async function handleSave(data: Parameters<typeof upsertActivity>[1]) {
    const result = await upsertActivity(workspaceId, data)
    refresh(result)
    setEditing(null)
    setAdding(false)
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await archiveActivity(workspaceId, id)
      setActivities(prev => prev.filter(a => a.id !== id))
      setDeletingId(null)
    })
  }

  function handleMarkReviewed(id: string) {
    startTransition(async () => {
      await markActivityReviewed(workspaceId, id)
      setActivities(prev => prev.map(a =>
        a.id === id ? { ...a, lastReviewedAt: new Date(), status: 'ACTIVE' as const } : a
      ))
    })
  }

  function exportCSV() {
    const headers = ['Activity','Purpose','Lawful Basis','Data Subjects','Personal Data','Recipients','Int. Transfers','Transfer Details','Retention','Security','Added','Last Reviewed']
    const esc = (v: string) => v.includes(',') || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v
    const rows = activities.map(a => [
      esc(a.name), esc(a.purpose ?? ''), esc(a.legalBasis ?? ''),
      esc(a.dataSubjectCategories.join('; ')), esc(a.personalDataCategories.join('; ')),
      esc(a.recipients.join('; ')),
      a.internationalTransfers ? 'Yes' : 'No',
      esc(a.transferSafeguards ?? ''),
      esc(a.retentionPeriod ?? ''), esc(a.securityMeasures ?? ''),
      esc(a.createdAt.toISOString().split('T')[0]),
      esc(a.lastReviewedAt ? a.lastReviewedAt.toISOString().split('T')[0] : ''),
    ])
    const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `ropa-${workspaceName.toLowerCase().replace(/\s+/g,'-')}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl" style={{ color: '#2C2C2C' }}>Record of Processing Activities</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(44,44,44,0.5)' }}>
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'} · {workspaceName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded border overflow-hidden text-xs" style={{ borderColor: 'rgba(139,115,85,0.25)' }}>
            {(['table', 'card'] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 capitalize transition-colors"
                style={{ backgroundColor: view === v ? '#8B7355' : 'transparent', color: view === v ? '#fff' : 'rgba(44,44,44,0.6)' }}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={exportCSV}
            className="px-3 py-1.5 text-xs rounded border transition-colors"
            style={{ borderColor: 'rgba(139,115,85,0.25)', color: 'rgba(44,44,44,0.65)' }}
          >
            Export CSV
          </button>
          <button onClick={() => { setEditing(null); setAdding(true) }}
            className="px-4 py-1.5 text-sm font-medium rounded transition-colors"
            style={{ backgroundColor: '#8B7355', color: '#fff' }}
          >
            + Add Activity
          </button>
        </div>
      </div>

      {/* Content */}
      {activities.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'rgba(44,44,44,0.4)' }}>
          <p className="font-playfair text-lg mb-2">No activities yet</p>
          <p className="text-sm">Add your first processing activity to begin building this ROPA.</p>
        </div>
      ) : view === 'table' ? (
        <TableView activities={activities} onEdit={setEditing} onDelete={setDeletingId} onMarkReviewed={handleMarkReviewed} />
      ) : (
        <CardView  activities={activities} onEdit={setEditing} onDelete={setDeletingId} onMarkReviewed={handleMarkReviewed} />
      )}

      {/* Add / Edit modal */}
      {(adding || editing) && (
        <WorkspaceActivityModal
          activity={editing}
          onSave={handleSave}
          onClose={() => { setAdding(false); setEditing(null) }}
        />
      )}

      {/* Delete confirm */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,44,44,0.4)' }}
          onClick={e => e.target === e.currentTarget && setDeletingId(null)}
        >
          <div className="w-full max-w-sm rounded-lg border p-6" style={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(139,115,85,0.2)' }}>
            <h3 className="font-playfair text-lg mb-2" style={{ color: '#2C2C2C' }}>Delete activity?</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(44,44,44,0.6)' }}>
              This permanently removes the record. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm rounded border"
                style={{ borderColor: 'rgba(139,115,85,0.25)', color: 'rgba(44,44,44,0.65)' }}
              >Cancel</button>
              <button onClick={() => handleDelete(deletingId)} disabled={pending}
                className="px-4 py-2 text-sm rounded font-medium disabled:opacity-60"
                style={{ backgroundColor: '#dc2626', color: '#fff' }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs" style={{ color: 'rgba(44,44,44,0.35)' }}>
        The Privacy Blueprint &nbsp;|&nbsp; Internal ROPA &nbsp;|&nbsp; UK GDPR Article 30 &nbsp;|&nbsp; Not for distribution
      </footer>
    </div>
  )
}

// ── Table view ────────────────────────────────────────────

function TableView({ activities, onEdit, onDelete, onMarkReviewed }: {
  activities: ProcessingActivity[]
  onEdit: (a: ProcessingActivity) => void
  onDelete: (id: string) => void
  onMarkReviewed: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'rgba(139,115,85,0.15)' }}>
      <table className="w-full border-collapse text-sm" style={{ minWidth: '1300px' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(139,115,85,0.06)', borderBottom: '1px solid rgba(139,115,85,0.12)' }}>
            {['#','Activity','Purpose','Lawful Basis','Data Subjects','Personal Data','Recipients','Transfers','Retention','Security','Last Reviewed','Actions']
              .map(h => <th key={h} className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: 'rgba(44,44,44,0.55)' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => {
            const overdue = a.lastReviewedAt && isOverdue(a.lastReviewedAt.toISOString().split('T')[0])
            return (
              <tr key={a.id} className="border-b hover:bg-brown/5 transition-colors"
                style={{ borderColor: 'rgba(139,115,85,0.08)', backgroundColor: i % 2 !== 0 ? 'rgba(255,255,255,0.3)' : undefined }}
              >
                <td className="px-3 py-3 text-xs" style={{ color: 'rgba(44,44,44,0.35)' }}>{i+1}</td>
                <td className="px-3 py-3 font-medium" style={{ minWidth: 160, color: '#2C2C2C' }}>
                  {a.name}
                  {overdue && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded border" style={{ backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>Review due</span>}
                </td>
                <td className="px-3 py-3" style={{ maxWidth: 200, color: 'rgba(44,44,44,0.75)' }}><div className="line-clamp-2">{a.purpose || '—'}</div></td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {a.legalBasis
                    ? <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#6B5540' }}>{a.legalBasis.replace(/_/g,' ')}</span>
                    : <span className="text-xs px-2 py-0.5 rounded border" style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>Missing</span>}
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: 'rgba(44,44,44,0.7)' }}>{a.dataSubjectCategories.join(', ') || '—'}</td>
                <td className="px-3 py-3" style={{ maxWidth: 180, color: 'rgba(44,44,44,0.75)' }}><div className="line-clamp-2">{a.personalDataCategories.join(', ') || '—'}</div></td>
                <td className="px-3 py-3" style={{ maxWidth: 160, color: 'rgba(44,44,44,0.75)' }}><div className="line-clamp-2">{a.recipients.join(', ') || '—'}</div></td>
                <td className="px-3 py-3 whitespace-nowrap text-xs" style={{ color: a.internationalTransfers ? '#b45309' : 'rgba(44,44,44,0.4)' }}>{a.internationalTransfers ? 'Yes' : 'No'}</td>
                <td className="px-3 py-3" style={{ maxWidth: 160, color: 'rgba(44,44,44,0.75)' }}><div className="line-clamp-2">{a.retentionPeriod || '—'}</div></td>
                <td className="px-3 py-3" style={{ maxWidth: 160, color: 'rgba(44,44,44,0.75)' }}><div className="line-clamp-2">{a.securityMeasures || '—'}</div></td>
                <td className="px-3 py-3 whitespace-nowrap text-xs" style={{ color: overdue ? '#b45309' : 'rgba(44,44,44,0.45)' }}>
                  {a.lastReviewedAt ? formatDate(a.lastReviewedAt.toISOString().split('T')[0]) : '—'}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onMarkReviewed(a.id)} className="text-xs px-2 py-1 rounded border transition-colors" style={{ borderColor: '#bbf7d0', color: '#15803d' }}>Reviewed</button>
                    <button onClick={() => onEdit(a)} className="text-xs px-2 py-1 rounded border transition-colors" style={{ borderColor: 'rgba(139,115,85,0.25)', color: '#8B7355' }}>Edit</button>
                    <button onClick={() => onDelete(a.id)} className="text-xs px-2 py-1 rounded border transition-colors" style={{ borderColor: '#fecaca', color: '#dc2626' }}>Delete</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Card view ─────────────────────────────────────────────

function CardView({ activities, onEdit, onDelete, onMarkReviewed }: {
  activities: ProcessingActivity[]
  onEdit: (a: ProcessingActivity) => void
  onDelete: (id: string) => void
  onMarkReviewed: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {activities.map(a => {
        const overdue = a.lastReviewedAt && isOverdue(a.lastReviewedAt.toISOString().split('T')[0])
        return (
          <div key={a.id} className="flex flex-col rounded-lg border overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(139,115,85,0.15)' }}>
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-playfair text-base font-semibold leading-snug flex-1" style={{ color: '#2C2C2C' }}>{a.name}</h3>
                {overdue && <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded border whitespace-nowrap" style={{ backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>Review due</span>}
              </div>
              {a.legalBasis
                ? <span className="inline-block text-xs px-2 py-0.5 rounded mt-1" style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#6B5540' }}>{a.legalBasis.replace(/_/g,' ')}</span>
                : <span className="inline-block text-xs px-2 py-0.5 rounded mt-1 border" style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>No legal basis assigned</span>}
            </div>
            <div className="h-px mx-5" style={{ backgroundColor: 'rgba(139,115,85,0.1)' }} />
            <dl className="px-5 py-4 space-y-2.5 flex-1 text-sm">
              {[
                ['Purpose',       a.purpose],
                ['Data subjects', a.dataSubjectCategories.join(', ')],
                ['Personal data', a.personalDataCategories.join(', ')],
                ['Recipients',    a.recipients.join(', ')],
                ['Transfers',     a.internationalTransfers ? `Yes — ${a.transferSafeguards || 'details not provided'}` : 'No'],
                ['Retention',     a.retentionPeriod],
                ['Security',      a.securityMeasures],
              ].filter(([,v]) => v).map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-xs uppercase tracking-wide mb-0.5" style={{ color: 'rgba(44,44,44,0.45)' }}>{label}</dt>
                  <dd style={{ color: 'rgba(44,44,44,0.85)' }}>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="px-5 pb-4 pt-3 border-t space-y-3" style={{ borderColor: 'rgba(139,115,85,0.1)' }}>
              <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(44,44,44,0.45)' }}>
                <span>Added {formatDate(a.createdAt.toISOString().split('T')[0])}</span>
                <span style={{ color: overdue ? '#b45309' : undefined }}>
                  {a.lastReviewedAt ? `Reviewed ${formatDate(a.lastReviewedAt.toISOString().split('T')[0])}` : 'Never reviewed'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onMarkReviewed(a.id)} className="flex-1 text-xs py-1.5 rounded border text-center transition-colors" style={{ borderColor: '#bbf7d0', color: '#15803d' }}>Mark Reviewed</button>
                <button onClick={() => onEdit(a)} className="flex-1 text-xs py-1.5 rounded border text-center transition-colors" style={{ borderColor: 'rgba(139,115,85,0.25)', color: '#8B7355' }}>Edit</button>
                <button onClick={() => onDelete(a.id)} className="flex-1 text-xs py-1.5 rounded border text-center transition-colors" style={{ borderColor: '#fecaca', color: '#dc2626' }}>Delete</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
