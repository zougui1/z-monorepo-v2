import path from 'node:path';

import { optimizeImage, processFile } from './processing';
import { DownloadSubmissionFileResult } from './types';
import { useTempDir } from '../../../utils';
import env from '../../../env';

export const downloadPreviewFile = async (url: string): Promise<DownloadSubmissionFileResult> => {
  return await useTempDir(env.processing.tempDir, async (tempDir, tempDirName) => {
    const extension = path.extname(url);
    const tempFile = path.join(tempDir, `${tempDirName}${extension}`);

    return await processFile(tempFile, {
      process: optimizeImage,
      originalDir: env.processing.previewDir,
      sampleDir: env.processing.previewDir,
    });
  });
}
