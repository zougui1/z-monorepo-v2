import OBSWebSocket from 'obs-websocket-js';
import { createWorker } from 'tesseract.js';

import { Manager } from './Manager';
import { manageRecord } from './manageRecord';
import { dungeonNameCharacters } from './constants';

export const startManageRecord = async (options: StartManageRecordOptions): Promise<void> => {
  const obs = new OBSWebSocket();
  await obs.connect(options.url, options.password);
  console.log('connected to OBS websocket servesr');

  const worker = await createWorker('eng');
  worker.setParameters({
    tessedit_char_whitelist: dungeonNameCharacters,
  });;

  const manager = new Manager({
    obs,
    worker,
    recordDir: options.recordDir,
  });

  await manageRecord(manager);
}

export interface StartManageRecordOptions {
  url: string;
  password: string;
  recordDir?: string | undefined;
}
