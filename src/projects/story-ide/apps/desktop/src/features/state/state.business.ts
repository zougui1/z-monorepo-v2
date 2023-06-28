import { workspaceManager } from '../../globals';

export const getState = (windowId: number): any => {
  const workspace = workspaceManager.findWorkspaceByWindowId(windowId);
  console.log('window', windowId, workspace?.data)
  return workspace?.data.state;
}
