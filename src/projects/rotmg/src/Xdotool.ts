import execa from 'execa';

import { toNumberOrThrow } from './utils';

export namespace Xdotool {
  const command = 'xdotool';

  export const getActiveWindow = async (): Promise<number> => {
    const { stdout } = await execa(command, ['getactivewindow']);
    return toNumberOrThrow(stdout);
  }

  export const getPidFromWindowId = async (windowId: number): Promise<number> => {
    const { stdout } = await execa(command, ['getwindowpid', String(windowId)]);
    return toNumberOrThrow(stdout, 'PID not found');
  }

  export const getWindowIdFromPid = async (pid: number): Promise<number> => {
    const { stdout } = await execa(command, ['search', '--onlyvisible', '--pid', String(pid)]);
    return toNumberOrThrow(stdout.split('\n')[0], 'window ID not found');
  }

  export const activateByWindowId = async (windowId: number): Promise<void> => {
    await execa(command, ['windowactivate', '--sync', String(windowId)]);
  }

  export const activateByWindowIdAndPressKey = async (windowId: number, key: string): Promise<void> => {
    await execa(command, ['windowactivate', '--sync', String(windowId), 'key', key]);
  }
}
