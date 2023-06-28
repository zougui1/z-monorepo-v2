import path from 'node:path';

import fs from 'fs-extra';

import { FileProcessingResult } from './types';
import { FileOptimizer } from '../../../../utils';
import env from '../../../../env';

export const optimizeImage = async (tempFile: string): Promise<FileProcessingResult> => {
  const tempSampleDir = path.join(path.dirname(tempFile), 'samples');

  await fs.ensureDir(tempSampleDir);
  const result = await new FileOptimizer(tempFile)
    .resize(env.processing.image.resize)
    .webp()
    .avif()
    .toFile({ dir: tempSampleDir });

  // should not happen; for type safety
  if (!result.webp || !result.avif) {
    throw new Error('Could not create samples');
  }

  return {
    original: tempFile,
    samples: [result.webp.file, result.avif.file],
  };
}
