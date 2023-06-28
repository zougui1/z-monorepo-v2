import execa from 'execa';

import { selectByPlatform } from '../os';

export const checkIsRunning = async (query: string): Promise<boolean> => {
  const [command, ...args] = selectByPlatform({
    win32: ['tasklist'],
    darwin: ['ps', '-ax', ' | ', query],
    linux: ['ps', '-A', ' | ', query],
  }) || [];

  if (!command) {
    return false;
  }

  const result = await execa(command, args);
  return result.stdout.toLowerCase().includes(query.toLowerCase());
}
