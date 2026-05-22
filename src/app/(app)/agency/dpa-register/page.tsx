export default function DPARegisterPage() {
  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="font-playfair text-2xl mb-2" style={{ color: '#2C2C2C' }}>DPA Register</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(44,44,44,0.5)' }}>Bulk view of agency-client DPA status across all workspaces.</p>
      <div className="rounded-lg border p-10 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'rgba(139,115,85,0.15)' }}>
        <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded mb-5" style={{ backgroundColor: 'rgba(139,115,85,0.1)', color: '#8B7355' }}>Phase 1 — coming next</span>
        <h2 className="font-playfair text-xl mb-3" style={{ color: '#2C2C2C' }}>Agency–Client DPA Register</h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(44,44,44,0.55)' }}>
          View and manage the Data Processing Agreement status between your agency and each client. Auto-generates a DPA when a workspace is created and tracks signature status.
        </p>
      </div>
    </div>
  )
}
