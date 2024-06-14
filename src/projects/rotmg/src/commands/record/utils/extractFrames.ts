import path from 'node:path';

import execa from 'execa';
import fs from 'fs-extra';

import { File } from '@zougui/common.fs';

import { ffmpegExecutable, frameExtractionTempDir } from '../../../constants';

export const extractFrames = async (filePath: string): Promise<ExtractFramesResult> => {
  const file = new File.Definition(filePath);
  const dir = path.join(frameExtractionTempDir, file.withoutExtension.fileName);
  const output = path.join(dir, 'frame-%d.jpg');

  try {
    await fs.ensureDir(dir);
    await execa(ffmpegExecutable, [
      '-i', filePath,
      '-y', output,
    ], {
      windowsHide: true,
    });

    const fileNames = await fs.readdir(dir);
    const framePaths = fileNames
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(fileName => path.join(dir, fileName));

    return {
      framePaths,
      tempDir: dir,
    };
  } catch (error) {
    await fs.remove(dir);
    throw error;
  }
}

export interface ExtractFramesResult {
  framePaths: string[];
  tempDir: string;
}
