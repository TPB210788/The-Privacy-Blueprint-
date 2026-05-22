import { validateWorkspaceAccess } from '@/lib/auth'
import { listActivities } from '@/lib/actions/ropa'
import WorkspaceROPA from './WorkspaceROPA'

export default async function WorkspaceROPAPage({ params }: { params: { workspaceId: string } }) {
  const { workspace } = await validateWorkspaceAccess(params.workspaceId)
  const activities = await listActivities(workspace.id)
  return <WorkspaceROPA workspaceId={workspace.id} workspaceName={workspace.name} initialActivities={activities} />
}
