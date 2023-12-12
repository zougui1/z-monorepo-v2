import type OBSWebSocket from 'obs-websocket-js';

import { wait } from '../../utils';

export const restartRecord = async (obs: OBSWebSocket): Promise<void> => {
  const { outputActive } = await obs.call('GetRecordStatus');

  if (!outputActive) {
    console.log('starting record');
    await obs.call('StartRecord');
    return;
  }

  console.log('stopping record');
  await obs.call('StopRecord');

  await wait(1500);
  await restartRecord(obs);
}
