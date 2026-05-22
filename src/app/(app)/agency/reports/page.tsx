export default function ReportsPage() {
  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="font-playfair text-2xl mb-2" style={{ color: '#2C2C2C' }}>Reports</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(44,44,44,0.5)' }}>Monthly compliance reports across all client workspaces.</p>
      <ComingSoon
        title="Client Compliance Reports"
        description="One-click monthly compliance reports per client — covering policies, cookie consent, DSRs, vendors, ROPA, DPIAs, and open action items. Exportable as branded PDF."
        phase="Phase 1 — coming next"
      />
    </div>
  )
}

function ComingSoon({ title, description, phase }: { title: string; description: string; phase: string }) {
  return (
    <div className="rounded-lg border p-10 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'rgba(139,115,85,0.15)' }}>
      <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded mb-5" style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#8B7355' }}>{phase}</span>
      <h2 className="font-playfair text-xl mb-3" style={{ color: '#2C2C2C' }}>{title}</h2>
      <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(44,44,44,0.55)' }}>{description}</p>
    </div>
  )
}
