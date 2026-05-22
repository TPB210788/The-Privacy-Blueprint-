import { validateWorkspaceAccess } from '@/lib/auth'
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar'

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspaceId: string }
}) {
  const { workspace, org } = await validateWorkspaceAccess(params.workspaceId)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F0EB' }}>
      <WorkspaceSidebar
        workspaceId={workspace.id}
        workspaceName={workspace.name}
        orgType={org.type}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
