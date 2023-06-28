import path from 'node:path';

import { processFile, optimizeFile } from './processing';
import { DownloadSubmissionFileResult } from './types';
import {
  downloadFile,
  useTempDir,
  getSimilarityHash,
} from '../../../utils';
import env from '../../../env';

export const downloadSubmissionFile = async (url: string): Promise<DownloadSubmissionFileResult> => {
  return await useTempDir(env.processing.tempDir, async (tempDir, tempDirName) => {
    const extension = path.extname(url);
    const tempFile = path.join(tempDir, `${tempDirName}${extension}`);

    await downloadFile(url, tempFile);

    const result = await processFile(tempFile, {
      process: optimizeFile,
      originalDir: env.processing.submissionDir,
      sampleDir: env.processing.submissionSampleDir,
    });

    const similarityHash = await getSimilarityHash(
      result.original.path,
      Math.round(env.processing.hashLength / 4),
    );

    return {
      ...result,
      original: {
        ...result.original,
        hash: similarityHash,
      },
    };
  });
}
