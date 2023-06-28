import { screen } from 'electron';

import { Percent } from '@zougui/common.percent-utils';

import { Workspace } from './Workspace';
import { WorkspaceCache } from './WorkspaceCache';
import { hashPath } from '../utils';
import { defaultUrl, widthPercent, heightPercent } from '../constants';

export class WorkspaceManager {
  readonly workspaces: Map<string, Workspace> = new Map();
  readonly cache: WorkspaceCache = new WorkspaceCache();

  readCachedWorkspace = async (path: string): Promise<void> => {
    const id = hashPath(path);
    const workspaceData = await this.cache.getWorkspace(id);

    if (!workspaceData) {
      return;
    }

    const workspace = new Workspace(workspaceData);
    this.workspaces.set(workspaceData.id, workspace);
  }

  createWorkspace = (path: string): void => {
    const point = screen.getCursorScreenPoint();
    const pointingDisplay = screen.getDisplayNearestPoint(point);

    const width = Percent.apply(widthPercent, pointingDisplay.bounds.width);
    const height = Percent.apply(heightPercent, pointingDisplay.bounds.height);

    // open the window centered to the currently focused screen screen
    const top = pointingDisplay.bounds.y + (pointingDisplay.bounds.height / 2) - (height / 2);
    const left = pointingDisplay.bounds.x + (pointingDisplay.bounds.width / 2) - (width / 2);

    const workspace = Workspace.new({
      path,
      width,
      height,
      top,
      left,
      url: defaultUrl,
      isFullscreen: false,
      isMaximized: false,
      isMinimized: false,
    });
    this.workspaces.set(workspace.id, workspace);
  }

  findWorkspaceByWindowId = (id: number): Workspace | undefined => {
    const workspaces = Array.from(this.workspaces.values());
    return workspaces.find(workspace => workspace.window?.id === id);
  }
}
