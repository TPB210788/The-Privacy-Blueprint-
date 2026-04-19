'use client';

import { useState, useEffect, useCallback } from 'react';
import { ROPAActivity } from '@/lib/types';

interface Props {
  activity: ROPAActivity | null;
  onSave: (activity: ROPAActivity) => void;
  onClose: () => void;
}

const LAWFUL_BASES = [
  'Contract',
  'Consent',
  'Legal obligation',
  'Vital interests',
  'Public task',
  'Legitimate interests',
];

const today = () => new Date().toISOString().split('T')[0];

function blankActivity(): ROPAActivity {
  return {
    id: '',
    name: '',
    purpose: '',
    lawfulBasis: 'Contract',
    dataSubjects: '',
    personalData: '',
    recipients: '',
    internationalTransfers: false,
    transferDetails: '',
    retentionPeriod: '',
    securityMeasures: '',
    dateAdded: today(),
    lastReviewed: today(),
  };
}

export default function ActivityModal({ activity, onSave, onClose }: Props) {
  const [form, setForm] = useState<ROPAActivity>(activity ?? blankActivity());
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    setForm(activity ?? blankActivity());
    setNameError('');
  }, [activity]);

  const set = (field: keyof ROPAActivity, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && value) setNameError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setNameError('Activity name is required');
      return;
    }
    onSave({ ...form, id: form.id || crypto.randomUUID() });
  };

  const handleBackdrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const inputClass = (hasError?: boolean) =>
    `w-full border ${hasError ? 'border-red-400' : 'border-brown/30'} rounded px-3 py-2 text-sm bg-white/80 text-charcoal focus:outline-none focus:border-brown transition-colors`;

  const textareaClass = `w-full border border-brown/30 rounded px-3 py-2 text-sm bg-white/80 text-charcoal focus:outline-none focus:border-brown transition-colors resize-none`;

  const labelClass = 'block text-xs font-medium text-charcoal/70 uppercase tracking-wide mb-1';

  return (
    <div
      className="fixed inset-0 bg-charcoal/40 z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-cream w-full max-w-2xl max-h-[92vh] flex flex-col rounded-lg border border-brown/20 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brown/15 flex-shrink-0">
          <h2 className="font-playfair text-xl text-charcoal">
            {activity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onClose}
            className="text-charcoal/40 hover:text-charcoal transition-colors p-1 rounded"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>
              Processing Activity Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className={inputClass(!!nameError)}
              placeholder="e.g. Client Onboarding"
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>

          {/* Purpose */}
          <div>
            <label className={labelClass}>Purpose</label>
            <textarea
              value={form.purpose}
              onChange={e => set('purpose', e.target.value)}
              rows={2}
              className={textareaClass}
              placeholder="Why are you processing this data?"
            />
          </div>

          {/* Lawful Basis */}
          <div>
            <label className={labelClass}>Lawful Basis</label>
            <select
              value={form.lawfulBasis}
              onChange={e => set('lawfulBasis', e.target.value)}
              className={inputClass()}
            >
              {LAWFUL_BASES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Data Subjects */}
          <div>
            <label className={labelClass}>Categories of Data Subjects</label>
            <input
              type="text"
              value={form.dataSubjects}
              onChange={e => set('dataSubjects', e.target.value)}
              className={inputClass()}
              placeholder="e.g. Clients, subscribers, prospective clients"
            />
          </div>

          {/* Personal Data */}
          <div>
            <label className={labelClass}>Categories of Personal Data</label>
            <textarea
              value={form.personalData}
              onChange={e => set('personalData', e.target.value)}
              rows={2}
              className={textareaClass}
              placeholder="e.g. Name, email address, business name"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className={labelClass}>Recipients / Third Parties</label>
            <textarea
              value={form.recipients}
              onChange={e => set('recipients', e.target.value)}
              rows={2}
              className={textareaClass}
              placeholder="e.g. Google Workspace, payment processor"
            />
          </div>

          {/* International Transfers */}
          <div>
            <label className={labelClass}>International Transfers</label>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                role="switch"
                aria-checked={form.internationalTransfers}
                onClick={() => set('internationalTransfers', !form.internationalTransfers)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brown/40 ${
                  form.internationalTransfers ? 'bg-brown' : 'bg-charcoal/20'
                }`}
              >
                <span
                  className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: form.internationalTransfers ? 'translateX(26px)' : 'translateX(2px)' }}
                />
              </button>
              <span className="text-sm text-charcoal/70">
                {form.internationalTransfers ? 'Yes — details below' : 'No'}
              </span>
            </div>
            {form.internationalTransfers && (
              <textarea
                value={form.transferDetails}
                onChange={e => set('transferDetails', e.target.value)}
                rows={2}
                className={textareaClass}
                placeholder="Country, organisation, and legal mechanism (e.g. SCCs)..."
              />
            )}
          </div>

          {/* Retention Period */}
          <div>
            <label className={labelClass}>Retention Period</label>
            <input
              type="text"
              value={form.retentionPeriod}
              onChange={e => set('retentionPeriod', e.target.value)}
              className={inputClass()}
              placeholder="e.g. 6 years post-engagement"
            />
          </div>

          {/* Security Measures */}
          <div>
            <label className={labelClass}>Security Measures</label>
            <textarea
              value={form.securityMeasures}
              onChange={e => set('securityMeasures', e.target.value)}
              rows={2}
              className={textareaClass}
              placeholder="e.g. Access controls, encryption, password protected"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date Added</label>
              <input
                type="date"
                value={form.dateAdded}
                onChange={e => set('dateAdded', e.target.value)}
                className={inputClass()}
              />
            </div>
            <div>
              <label className={labelClass}>Last Reviewed</label>
              <input
                type="date"
                value={form.lastReviewed}
                onChange={e => set('lastReviewed', e.target.value)}
                className={inputClass()}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-brown/15 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-charcoal/70 border border-brown/25 rounded hover:bg-brown/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm bg-brown text-white rounded hover:bg-brown-hover transition-colors font-medium"
          >
            {activity ? 'Save Changes' : 'Add Activity'}
          </button>
        </div>
      </div>
    </div>
  );
}
