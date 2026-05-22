'use client'

import { useState, useEffect } from 'react'
import type { ProcessingActivity, LegalBasis, ControllerRole } from '@prisma/client'

type SaveData = {
  id?: string
  name: string; purpose?: string; legalBasis?: LegalBasis | ''
  legalBasisNotes?: string
  dataSubjectCategories?: string[]; personalDataCategories?: string[]
  sensitiveDataCategories?: string[]; recipients?: string[]
  internationalTransfers?: boolean; transferCountries?: string[]
  transferSafeguards?: string; retentionPeriod?: string
  deletionProcess?: string; securityMeasures?: string
  controllerDesignation?: ControllerRole | ''; lastReviewedAt?: string | null
}

interface Props {
  activity: ProcessingActivity | null
  onSave:   (data: SaveData) => Promise<void>
  onClose:  () => void
}

const LEGAL_BASES: LegalBasis[] = [
  'CONSENT','CONTRACT','LEGAL_OBLIGATION','VITAL_INTERESTS','PUBLIC_TASK','LEGITIMATE_INTERESTS',
]
const CONTROLLER_ROLES: ControllerRole[] = ['CONTROLLER','PROCESSOR','JOINT_CONTROLLER']

function blank(): SaveData {
  return {
    name:'', purpose:'', legalBasis:'', legalBasisNotes:'',
    dataSubjectCategories:[], personalDataCategories:[], sensitiveDataCategories:[],
    recipients:[], internationalTransfers:false, transferCountries:[],
    transferSafeguards:'', retentionPeriod:'', deletionProcess:'', securityMeasures:'',
    controllerDesignation:'', lastReviewedAt: new Date().toISOString().split('T')[0],
  }
}

function fromActivity(a: ProcessingActivity): SaveData {
  return {
    id: a.id, name: a.name, purpose: a.purpose ?? '',
    legalBasis: a.legalBasis ?? '', legalBasisNotes: a.legalBasisNotes ?? '',
    dataSubjectCategories: a.dataSubjectCategories, personalDataCategories: a.personalDataCategories,
    sensitiveDataCategories: a.sensitiveDataCategories, recipients: a.recipients,
    internationalTransfers: a.internationalTransfers, transferCountries: a.transferCountries,
    transferSafeguards: a.transferSafeguards ?? '', retentionPeriod: a.retentionPeriod ?? '',
    deletionProcess: a.deletionProcess ?? '', securityMeasures: a.securityMeasures ?? '',
    controllerDesignation: a.controllerDesignation ?? '',
    lastReviewedAt: a.lastReviewedAt ? a.lastReviewedAt.toISOString().split('T')[0] : null,
  }
}

const inp = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-brown transition-colors bg-white/80'
const inpStyle = { borderColor: 'rgba(139,115,85,0.3)', color: '#2C2C2C' }
const lbl = 'block text-xs font-medium uppercase tracking-wide mb-1.5'
const lblStyle = { color: 'rgba(44,44,44,0.65)' }

function tagList(
  value: string[],
  onChange: (v: string[]) => void,
  placeholder: string,
) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setInput('')
  }
  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-1.5">
        {value.map(v => (
          <span key={v} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#6B5540' }}>
            {v}
            <button onClick={() => onChange(value.filter(x => x !== v))} className="hover:opacity-70">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          className={inp} style={inpStyle} placeholder={placeholder} />
        <button type="button" onClick={add}
          className="px-3 text-xs rounded border whitespace-nowrap"
          style={{ borderColor: 'rgba(139,115,85,0.3)', color: '#8B7355' }}>Add</button>
      </div>
    </div>
  )
}

export default function WorkspaceActivityModal({ activity, onSave, onClose }: Props) {
  const [form, setForm]     = useState<SaveData>(activity ? fromActivity(activity) : blank())
  const [saving, setSaving] = useState(false)
  const [nameErr, setNameErr] = useState('')

  useEffect(() => { setForm(activity ? fromActivity(activity) : blank()); setNameErr('') }, [activity])

  const set = <K extends keyof SaveData>(k: K, v: SaveData[K]) => {
    setForm(p => ({ ...p, [k]: v }))
    if (k === 'name') setNameErr('')
  }

  async function submit() {
    if (!form.name.trim()) { setNameErr('Activity name is required'); return }
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(44,44,44,0.4)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-lg border"
        style={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(139,115,85,0.2)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(139,115,85,0.15)' }}>
          <h2 className="font-playfair text-xl" style={{ color: '#2C2C2C' }}>
            {activity ? 'Edit Activity' : 'Add Processing Activity'}
          </h2>
          <button onClick={onClose} style={{ color: 'rgba(44,44,44,0.4)' }}>✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={lbl} style={lblStyle}>Activity Name <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className={inp} style={{ ...inpStyle, borderColor: nameErr ? '#dc2626' : 'rgba(139,115,85,0.3)' }}
              placeholder="e.g. Email Marketing" />
            {nameErr && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{nameErr}</p>}
          </div>

          {/* Purpose */}
          <div>
            <label className={lbl} style={lblStyle}>Purpose</label>
            <textarea value={form.purpose} onChange={e => set('purpose', e.target.value)}
              rows={2} className={inp} style={inpStyle}
              placeholder="Why are you processing this data?" />
          </div>

          {/* Legal basis */}
          <div>
            <label className={lbl} style={lblStyle}>Lawful Basis</label>
            <select value={form.legalBasis} onChange={e => set('legalBasis', e.target.value as LegalBasis | '')}
              className={inp} style={inpStyle}>
              <option value="">— Select —</option>
              {LEGAL_BASES.map(b => <option key={b} value={b}>{b.replace(/_/g,' ')}</option>)}
            </select>
          </div>

          {/* Controller designation */}
          <div>
            <label className={lbl} style={lblStyle}>Controller / Processor Designation</label>
            <select value={form.controllerDesignation} onChange={e => set('controllerDesignation', e.target.value as ControllerRole | '')}
              className={inp} style={inpStyle}>
              <option value="">— Select —</option>
              {CONTROLLER_ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
            </select>
          </div>

          {/* Data subjects */}
          <div>
            <label className={lbl} style={lblStyle}>Categories of Data Subjects</label>
            {tagList(form.dataSubjectCategories ?? [], v => set('dataSubjectCategories', v), 'e.g. Clients, Subscribers')}
          </div>

          {/* Personal data */}
          <div>
            <label className={lbl} style={lblStyle}>Categories of Personal Data</label>
            {tagList(form.personalDataCategories ?? [], v => set('personalDataCategories', v), 'e.g. Name, Email address')}
          </div>

          {/* Recipients */}
          <div>
            <label className={lbl} style={lblStyle}>Recipients / Third Parties</label>
            {tagList(form.recipients ?? [], v => set('recipients', v), 'e.g. Google Workspace, Mailchimp')}
          </div>

          {/* International transfers */}
          <div>
            <label className={lbl} style={lblStyle}>International Transfers</label>
            <div className="flex items-center gap-3 mb-2">
              <button type="button" role="switch" aria-checked={form.internationalTransfers}
                onClick={() => set('internationalTransfers', !form.internationalTransfers)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: form.internationalTransfers ? '#8B7355' : 'rgba(44,44,44,0.2)' }}>
                <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: form.internationalTransfers ? 'translateX(26px)' : 'translateX(2px)' }} />
              </button>
              <span className="text-sm" style={{ color: 'rgba(44,44,44,0.7)' }}>
                {form.internationalTransfers ? 'Yes' : 'No'}
              </span>
            </div>
            {form.internationalTransfers && (
              <textarea value={form.transferSafeguards} onChange={e => set('transferSafeguards', e.target.value)}
                rows={2} className={inp} style={inpStyle}
                placeholder="Countries, organisations, and safeguards (e.g. SCCs)…" />
            )}
          </div>

          {/* Retention */}
          <div>
            <label className={lbl} style={lblStyle}>Retention Period</label>
            <input type="text" value={form.retentionPeriod} onChange={e => set('retentionPeriod', e.target.value)}
              className={inp} style={inpStyle} placeholder="e.g. 6 years post-engagement" />
          </div>

          {/* Security */}
          <div>
            <label className={lbl} style={lblStyle}>Security Measures</label>
            <textarea value={form.securityMeasures} onChange={e => set('securityMeasures', e.target.value)}
              rows={2} className={inp} style={inpStyle}
              placeholder="e.g. Access controls, encryption, password protected" />
          </div>

          {/* Last reviewed */}
          <div>
            <label className={lbl} style={lblStyle}>Last Reviewed</label>
            <input type="date" value={form.lastReviewedAt ?? ''}
              onChange={e => set('lastReviewedAt', e.target.value || null)}
              className={inp} style={inpStyle} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: 'rgba(139,115,85,0.15)' }}>
          <button onClick={onClose} className="px-4 py-2 text-sm rounded border"
            style={{ borderColor: 'rgba(139,115,85,0.25)', color: 'rgba(44,44,44,0.65)' }}>
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="px-5 py-2 text-sm font-medium rounded disabled:opacity-60"
            style={{ backgroundColor: '#8B7355', color: '#fff' }}>
            {saving ? 'Saving…' : activity ? 'Save Changes' : 'Add Activity'}
          </button>
        </div>
      </div>
    </div>
  )
}
