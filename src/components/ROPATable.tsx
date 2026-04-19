'use client';

import { ROPAActivity } from '@/lib/types';
import { isOverdue, formatDate } from '@/lib/utils';

interface Props {
  activities: ROPAActivity[];
  onEdit: (activity: ROPAActivity) => void;
  onDelete: (id: string) => void;
  onMarkReviewed: (id: string) => void;
}

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-3 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide whitespace-nowrap">
    {children}
  </th>
);

export default function ROPATable({ activities, onEdit, onDelete, onMarkReviewed }: Props) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-16 text-charcoal/40">
        <p className="font-playfair text-lg mb-2">No activities yet</p>
        <p className="text-sm">Add your first processing activity to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll rounded-lg border border-brown/15">
      <table className="w-full border-collapse text-sm" style={{ minWidth: '1280px' }}>
        <thead>
          <tr className="bg-brown/8 border-b border-brown/15" style={{ backgroundColor: 'rgba(139,115,85,0.06)' }}>
            <TH>#</TH>
            <TH>Activity</TH>
            <TH>Purpose</TH>
            <TH>Lawful Basis</TH>
            <TH>Data Subjects</TH>
            <TH>Personal Data</TH>
            <TH>Recipients</TH>
            <TH>Transfers</TH>
            <TH>Retention</TH>
            <TH>Security</TH>
            <TH>Added</TH>
            <TH>Last Reviewed</TH>
            <TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {activities.map((a, i) => {
            const overdue = isOverdue(a.lastReviewed);
            return (
              <tr
                key={a.id}
                className="border-b border-brown/10 hover:bg-brown/5 transition-colors"
                style={{ backgroundColor: i % 2 !== 0 ? 'rgba(255,255,255,0.35)' : undefined }}
              >
                <td className="px-3 py-3 text-charcoal/35 text-xs tabular-nums">{i + 1}</td>

                {/* Activity name */}
                <td className="px-3 py-3" style={{ minWidth: '180px' }}>
                  <div className="font-medium text-charcoal">{a.name}</div>
                  {overdue && (
                    <span className="inline-block mt-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                      Review overdue
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-charcoal/75" style={{ maxWidth: '220px' }}>
                  <div className="line-clamp-2">{a.purpose || '—'}</div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#6B5540' }}
                  >
                    {a.lawfulBasis}
                  </span>
                </td>

                <td className="px-3 py-3 text-charcoal/75 whitespace-nowrap">{a.dataSubjects || '—'}</td>

                <td className="px-3 py-3 text-charcoal/75" style={{ maxWidth: '200px' }}>
                  <div className="line-clamp-2">{a.personalData || '—'}</div>
                </td>

                <td className="px-3 py-3 text-charcoal/75" style={{ maxWidth: '180px' }}>
                  <div className="line-clamp-2">{a.recipients || '—'}</div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  {a.internationalTransfers ? (
                    <span className="text-amber-700 font-medium text-xs">Yes</span>
                  ) : (
                    <span className="text-charcoal/40 text-xs">No</span>
                  )}
                </td>

                <td className="px-3 py-3 text-charcoal/75" style={{ maxWidth: '160px' }}>
                  <div className="line-clamp-2">{a.retentionPeriod || '—'}</div>
                </td>

                <td className="px-3 py-3 text-charcoal/75" style={{ maxWidth: '180px' }}>
                  <div className="line-clamp-2">{a.securityMeasures || '—'}</div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap text-xs text-charcoal/45">
                  {formatDate(a.dateAdded)}
                </td>

                <td className="px-3 py-3 whitespace-nowrap text-xs">
                  <span className={overdue ? 'text-amber-700 font-semibold' : 'text-charcoal/45'}>
                    {formatDate(a.lastReviewed)}
                  </span>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onMarkReviewed(a.id)}
                      className="text-xs px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
                      title="Mark as reviewed today"
                    >
                      Reviewed
                    </button>
                    <button
                      onClick={() => onEdit(a)}
                      className="text-xs px-2 py-1 rounded border border-brown/25 text-brown hover:bg-brown/5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(a.id)}
                      className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
