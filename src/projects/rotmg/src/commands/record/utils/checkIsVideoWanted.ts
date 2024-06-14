import path from 'node:path';

import sharp from 'sharp';
import fs from 'fs-extra';

import { extractFrames } from './extractFrames'
import { checkIsVideoValid } from './checkIsVideoValid';
import { videoSizeThreshold } from '../constants';

export const checkIsVideoWanted = async (filePath: string): Promise<boolean> => {
  const fileName = path.basename(filePath);

  // if the filename contains a separator that means it is an alternative video
  // so we don't need to conserve it
  if (fileName.includes('|')) {
    return false;
  }

  const fileStats = await fs.stat(filePath);

  if (fileStats.size < videoSizeThreshold) {
    console.log('video is too light');
    return false;
  }

  return await checkIsVideoValid(filePath);

  console.log('extracting frames...');
  const { framePaths, tempDir } = await extractFrames(filePath);

  try {
    console.log('detecting in-game location...');

    for (const framePath of framePaths) {
      console.log(path.basename(framePath));

      const charSpot = await sharp(framePath).extract({
        left: 20,
        top: 20,
        height: 80,
        width: 80,
      }).raw().toBuffer();
      const allBlack = charSpot.every(rgb => rgb === 0);

      if (allBlack) {
        continue;
      }

      return true;
    }

    return false;
  } finally {
    await fs.remove(tempDir);
  }
}
