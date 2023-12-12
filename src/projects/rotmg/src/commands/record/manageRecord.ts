import type OBSWebSocket from 'obs-websocket-js';

import { checkIsLoadingScreen } from './checkIsLoadingScreen';
import { restartRecord } from './restartRecord';
import { wait } from '../../utils';

export const manageRecord = async (obs: OBSWebSocket): Promise<void> => {
  const isLoading = await checkIsLoadingScreen();

  if (!isLoading) {
    await wait(1000);
    manageRecord(obs);
    return;
  }

  await wait(1500);
  await restartRecord(obs);

  // wait 5 seconds before restarting the record management to
  // prevent the record from being restarted more than once
  await wait(5000);
  manageRecord(obs);
}
