import { app, ipcMain } from 'electron';
import { tryit } from 'radash';

import type { ElectronRequest } from '@zougui/story-ide.types';

import { workspaceManager } from './globals';
import { router } from './router';
import { Handler } from './utils';


export const createApp = async (dir: string): Promise<void> => {
  await app.whenReady();
  await startApp(dir);
}

const startApp = async (dir: string): Promise<void> => {
  ipcMain.on('state', (event, state) => {
    const workspace = workspaceManager.findWorkspaceByWindowId(event.sender.id);
    workspace?.persistState(state);
  });

  const [error] = await tryit(workspaceManager.readCachedWorkspace)(dir);

  if (error || workspaceManager.workspaces.size === 0) {
    if (error) console.log('error', error)

    console.log('create new workspace');
    workspaceManager.createWorkspace(dir);
  }

  for (const [path, handler] of Object.entries(router.handlers)) {
    handleRoute(path, handler);
  }

  for (const workspace of workspaceManager.workspaces.values()) {
    await workspace.createWindow();
  }
}

const handleRoute = (path: string, handler: Handler): void => {
  ipcMain.on(path, async (event, req: ElectronRequest) => {
    try {
      console.log(path);
      const body = await handler.schemas.params.parseAsync(req.body);
      const result = await handler.handle({
        ...req,
        body,
        sender: { id: event.sender.id },
      });
      const response: ElectronRequest = {
        headers: { id: req.headers.id },
        body: result,
      };

      event.reply(`${path}.success`, response);
    } catch (error) {
      console.log('communication error:', error);

      const response: ElectronRequest = {
        headers: { id: req.headers.id },
        body: error,
      };
      event.reply(`${path}.error`, response);
    }
  });
}
