import OBSWebSocket from 'obs-websocket-js';

import { manageRecord } from './manageRecord';

export const startManageRecord = async (options: StartManageRecordOptions): Promise<void> => {
  const obs = new OBSWebSocket();
  await obs.connect(options.url, options.password);
  console.log('connected to OBS websocket servesr');
  await manageRecord(obs);
}

export interface StartManageRecordOptions {
  url: string;
  password: string;
}
