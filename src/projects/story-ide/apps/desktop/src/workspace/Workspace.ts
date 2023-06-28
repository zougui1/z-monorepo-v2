import path from 'node:path';

import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import fs from 'fs-extra';

import { WorkspaceData } from './WorkspaceData';
import { hashPath, debounceAsync } from '../utils';
import { appCacheDir } from '../constants';

const persistDelay = 300;

export class Workspace {
  readonly data: WorkspaceData;
  readonly id: string;
  window: BrowserWindow | undefined;

  constructor(data: WorkspaceData) {
    this.data = data;
    this.id = data.id;
  }

  //#region static methods
  static new(options: Omit<WorkspaceData, 'id'>): Workspace {
    const id = hashPath(options.path);
    return new Workspace({
      ...options,
      id,
    });
  }
  //#endregion

  createWindow = async (): Promise<BrowserWindow> => {
    this.window = new BrowserWindow({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        webSecurity: true,
        preload: path.join(__dirname, '../preload.js'),
      },
      width: this.data.width,
      height: this.data.height,
      fullscreen: this.data.isFullscreen,
    });

    this.window.setPosition(this.data.left, this.data.top);

    if (this.data.isMaximized) {
      this.window.maximize();
    }

    if (this.data.isMinimized) {
      this.window.minimize();
    }

    this.window.loadURL(this.data.url);

    if (isDev) {
      this.window.webContents.toggleDevTools();
    }

    this.window.webContents.on('update-target-url', async (event, url) => {
      // sometimes the URL is an empty string
      if (!url) {
        return;
      }

      // TODO validate that the URL is a valid URL and points to the correct host
      this.data.url = url;
      // TODO log error
      await this.persist();
    });

    this.window.on('resize', async () => {
      // set undefined in the array to ensure type-safety with type inference
      const [width, height] = this.window?.getSize() || [undefined];

      if (!width || !height) {
        return;
      }

      this.data.width = width;
      this.data.height = height;
      await this.persist();
    });

    this.window.on('move', async () => {
      // set undefined in the array to ensure type-safety with type inference
      const [left, top] = this.window?.getPosition() || [undefined];

      if (!top || !left) {
        return;
      }

      this.data.top = top;
      this.data.left = left;
      await this.persist();
    });

    this.window.on('maximize', async () => {
      this.data.isMaximized = true;
      await this.persist();
    });

    this.window.on('unmaximize', async () => {
      // the event unmaximized is triggered when the window is minimized
      // but we want to keep it maximized in the cache so that when the user
      // reopens the window it will be maximized when the user unminimizes the window
      if (this.window?.isMinimized()) {
        return;
      }

      this.data.isMaximized = false;
      await this.persist();
    });

    this.window.on('minimize', async () => {
      this.data.isMinimized = true;
      await this.persist();
    });

    this.window.on('focus', async () => {
      this.data.isMinimized = false;
      await this.persist();
    });

    this.window.on('enter-full-screen', async () => {
      this.data.isFullscreen = true;
      await this.persist();
    });

    this.window.on('leave-full-screen', async () => {
      this.data.isFullscreen = false;
      await this.persist();
    });

    // TODO log
    await this.persist().catch(() => { });

    return this.window;
  }

  persist = debounceAsync({ delay: persistDelay }, async (): Promise<void> => {
    await fs.ensureDir(appCacheDir);
    await fs.writeJson(path.join(appCacheDir, this.data.id), this.data, { spaces: 2 });
  });

  persistState = async (state: WorkspaceData['state']): Promise<void> => {
    this.data.state = state;
    await this.persist();
  }
}
