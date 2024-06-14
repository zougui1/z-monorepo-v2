import os from 'node:os';
import path from 'node:path';

import fs from 'fs-extra';
import execa from 'execa';
import { nanoid } from 'nanoid';

export const createTempScreenshot = async <T>(dimension: string, callback: TempScreenshotCallback<T>): Promise<T> => {
  const tempFile = path.join(os.tmpdir(), `${nanoid()}.png`);

  // make sure the file doesn't already exist
  // as scrot will create the file with another name otherwise
  await fs.remove(tempFile);

  try {
    // takes a screenshot of a small section of the top left corner
    // of the main monitor
    await execa('scrot', ['-a', dimension, tempFile]);
    return await callback(tempFile);
  } finally {
    await fs.remove(tempFile);
  }
}

export type TempScreenshotCallback<T> = (path: string) => (Promise<T> | T);
