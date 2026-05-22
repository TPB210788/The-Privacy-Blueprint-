'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWorkspace } from '@/lib/actions/workspace'

const BUSINESS_TYPES = [
  'E-commerce', 'Professional Services', 'Healthcare', 'Legal',
  'Marketing Agency', 'Tech / SaaS', 'Hospitality', 'Education',
  'Finance', 'Retail', 'Media / Content', 'Other',
]

const JURISDICTIONS = [
  { value: 'UK', label: 'United Kingdom (UK GDPR)' },
  { value: 'EU', label: 'European Union (EU GDPR)' },
  { value: 'US', label: 'United States (CCPA)' },
  { value: 'OTHER', label: 'Other jurisdiction' },
]

const inputCls = 'w-full border rounded px-3 py-2.5 text-sm focus:outline-none transition-colors'
const inputStyle = { borderColor: 'rgba(139,115,85,0.3)', backgroundColor: 'rgba(255,255,255,0.8)', color: '#2C2C2C' }
const labelCls = 'block text-xs font-medium uppercase tracking-wide mb-1.5'
const labelStyle = { color: 'rgba(44,44,44,0.65)' }

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    name: '', clientEmail: '', businessType: '', jurisdiction: [] as string[], websiteUrl: '',
  })

  const set = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const toggleJ = (v: string) =>
    set('jurisdiction', form.jurisdiction.includes(v)
      ? form.jurisdiction.filter(j => j !== v)
      : [...form.jurisdiction, v])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Client name is required'); return }
    setLoading(true); setError('')
    try {
      const res = await createWorkspace(form)
      if (res.error) { setError(res.error); return }
      router.push(`/workspace/${res.workspaceId}`)
    } catch { setError('Something went wrong. Please try again.') }
    finally   { setLoading(false) }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-2">
        <Link href="/agency" className="text-xs" style={{ color: 'rgba(44,44,44,0.45)' }}>← All clients</Link>
      </div>
      <h1 className="font-playfair text-2xl mb-1" style={{ color: '#2C2C2C' }}>Add Client Workspace</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(44,44,44,0.5)' }}>
        Create an isolated compliance workspace for your client.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className={labelCls} style={labelStyle}>
            Client / Business Name <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text" value={form.name} onChange={e => set('name', e.target.value)}
            className={inputCls} style={inputStyle} placeholder="Acme Ltd"
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelCls} style={labelStyle}>Client Contact Email</label>
          <input
            type="email" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)}
            className={inputCls} style={inputStyle} placeholder="contact@acmeltd.com"
          />
        </div>

        {/* Business type */}
        <div>
          <label className={labelCls} style={labelStyle}>Business Type</label>
          <select
            value={form.businessType} onChange={e => set('businessType', e.target.value)}
            className={inputCls} style={inputStyle}
          >
            <option value="">Select…</option>
            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Jurisdictions */}
        <div>
          <label className={labelCls} style={labelStyle}>Jurisdictions (select all that apply)</label>
          <div className="grid grid-cols-2 gap-2">
            {JURISDICTIONS.map(j => {
              const checked = form.jurisdiction.includes(j.value)
              return (
                <label
                  key={j.value}
                  className="flex items-center gap-2.5 p-3 rounded border cursor-pointer transition-colors text-sm"
                  style={{
                    borderColor:     checked ? '#8B7355' : 'rgba(139,115,85,0.25)',
                    backgroundColor: checked ? 'rgba(139,115,85,0.06)' : 'rgba(255,255,255,0.5)',
                    color: '#2C2C2C',
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleJ(j.value)} className="rounded" />
                  {j.label}
                </label>
              )
            })}
          </div>
        </div>

        {/* Website */}
        <div>
          <label className={labelCls} style={labelStyle}>Website URL</label>
          <input
            type="url" value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
            className={inputCls} style={inputStyle} placeholder="https://acmeltd.com"
          />
        </div>

        {error && (
          <p className="text-sm rounded px-3 py-2 border" style={{ color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2.5 text-sm rounded border transition-colors"
            style={{ borderColor: 'rgba(139,115,85,0.25)', color: 'rgba(44,44,44,0.65)' }}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 text-sm font-medium rounded transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#8B7355', color: '#fff' }}
          >
            {loading ? 'Creating…' : 'Create Workspace →'}
          </button>
        </div>
      </form>
    </div>
  )
}
