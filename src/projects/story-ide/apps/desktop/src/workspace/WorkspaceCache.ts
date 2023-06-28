import path from 'node:path';

import fs from 'fs-extra';

import { workspaceDataSchema, WorkspaceData } from './WorkspaceData';
import { appCacheDir } from '../constants';

export class WorkspaceCache {
  getFile = async (fileName: string): Promise<string | undefined> => {
    await fs.ensureDir(appCacheDir);
    const nodePath = path.join(appCacheDir, fileName);
    const stats = await fs.stat(nodePath);

    if (!stats.isFile()) {
      return;
    }

    return nodePath;
  }

  getWorkspace = async (fileName: string): Promise<WorkspaceData | undefined> => {
    try {
      const file = await this.getFile(fileName);

      if (!file) {
        return;
      }

      const dirtyData = await fs.readJson(file);
      const data = await workspaceDataSchema.parseAsync(dirtyData);
      const targetNodeStats = await fs.stat(data.path);

      if (!targetNodeStats.isDirectory()) {
        return;
      }

      return data;
    } catch (error) {
      console.log(error)
      // TODO log error
    }
  }
}
