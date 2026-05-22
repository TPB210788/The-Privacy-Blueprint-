import { getAuthOrg } from '@/lib/auth'

export default async function AgencySettingsPage() {
  const org = await getAuthOrg()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="font-playfair text-2xl mb-1" style={{ color: '#2C2C2C' }}>Agency Settings</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(44,44,44,0.5)' }}>Manage your agency account, branding, and billing.</p>

      <div className="space-y-4">
        <Section title="Organisation">
          <Row label="Name"        value={org?.name          ?? '—'} />
          <Row label="Brand name"  value={org?.agencyBrandName ?? '— (uses organisation name)'} />
          <Row label="Account type" value={org?.type ?? '—'} />
        </Section>

        <Section title="Billing">
          <Row label="Plan"   value={(org as any)?.billing?.planTier?.replace(/_/g,' ') ?? 'No active subscription'} />
          <Row label="Status" value={(org as any)?.billing?.status ?? '—'} />
          <Row label="Client workspace limit" value={(org as any)?.billing?.workspaceLimit === -1 ? 'Unlimited' : ((org as any)?.billing?.workspaceLimit ?? '—').toString()} />
        </Section>

        <div className="rounded-lg border p-5 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'rgba(139,115,85,0.15)' }}>
          <p className="text-sm mb-3" style={{ color: 'rgba(44,44,44,0.6)' }}>
            Full settings — agency branding, white-label options, team management, and billing portal — coming in Phase 1.
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'rgba(139,115,85,0.15)' }}>
      <div className="px-5 py-3 border-b" style={{ backgroundColor: 'rgba(139,115,85,0.05)', borderColor: 'rgba(139,115,85,0.12)' }}>
        <h2 className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{title}</h2>
      </div>
      <div className="divide-y" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm" style={{ borderColor: 'rgba(139,115,85,0.08)' }}>
      <span style={{ color: 'rgba(44,44,44,0.55)' }}>{label}</span>
      <span style={{ color: '#2C2C2C' }}>{value}</span>
    </div>
  )
}
