import { getAuthOrg } from '@/lib/auth'
import AgencySidebar from '@/components/agency/AgencySidebar'

export default async function AgencyLayout({ children }: { children: React.ReactNode }) {
  const org = await getAuthOrg()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F0EB' }}>
      <AgencySidebar orgName={org?.name ?? ''} brandName={org?.agencyBrandName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
