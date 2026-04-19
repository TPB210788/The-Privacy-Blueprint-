'use client';

import { ROPAActivity } from '@/lib/types';
import { isOverdue, formatDate } from '@/lib/utils';

interface Props {
  activities: ROPAActivity[];
  onEdit: (activity: ROPAActivity) => void;
  onDelete: (id: string) => void;
  onMarkReviewed: (id: string) => void;
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-charcoal/45 uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className={`text-sm leading-snug ${highlight ? 'text-amber-700 font-medium' : 'text-charcoal/85'}`}>
        {value}
      </dd>
    </div>
  );
}

export default function ROPACards({ activities, onEdit, onDelete, onMarkReviewed }: Props) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-16 text-charcoal/40">
        <p className="font-playfair text-lg mb-2">No activities yet</p>
        <p className="text-sm">Add your first processing activity to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {activities.map(a => {
        const overdue = isOverdue(a.lastReviewed);
        return (
          <div
            key={a.id}
            className="flex flex-col bg-white/55 border border-brown/15 rounded-lg overflow-hidden hover:border-brown/30 transition-colors"
          >
            {/* Card header */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-playfair text-base font-semibold text-charcoal leading-snug flex-1">
                  {a.name}
                </h3>
                {overdue && (
                  <span className="flex-shrink-0 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded whitespace-nowrap">
                    Review overdue
                  </span>
                )}
              </div>

              {/* Lawful basis pill */}
              <span
                className="inline-block text-xs px-2 py-0.5 rounded mt-1"
                style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#6B5540' }}
              >
                {a.lawfulBasis}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-brown/10 mx-5" />

            {/* Card body */}
            <dl className="px-5 py-4 space-y-3 flex-1">
              <Field label="Purpose" value={a.purpose} />
              <Field label="Data Subjects" value={a.dataSubjects} />
              <Field label="Personal Data" value={a.personalData} />
              <Field label="Recipients" value={a.recipients} />
              <Field
                label="International Transfers"
                value={
                  a.internationalTransfers
                    ? `Yes — ${a.transferDetails || 'details not provided'}`
                    : 'No'
                }
                highlight={a.internationalTransfers}
              />
              <Field label="Retention Period" value={a.retentionPeriod} />
              <Field label="Security Measures" value={a.securityMeasures} />
            </dl>

            {/* Card footer */}
            <div className="px-5 pb-4 pt-3 border-t border-brown/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-charcoal/45">
                <span>Added {formatDate(a.dateAdded)}</span>
                <span className={overdue ? 'text-amber-700 font-semibold' : ''}>
                  Reviewed {formatDate(a.lastReviewed)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onMarkReviewed(a.id)}
                  className="flex-1 text-xs py-1.5 rounded border border-green-200 text-green-700 hover:bg-green-50 transition-colors text-center"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => onEdit(a)}
                  className="flex-1 text-xs py-1.5 rounded border border-brown/25 text-brown hover:bg-brown/5 transition-colors text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(a.id)}
                  className="flex-1 text-xs py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-center"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
