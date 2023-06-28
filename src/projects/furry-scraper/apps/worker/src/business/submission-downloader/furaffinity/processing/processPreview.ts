import path from 'node:path';

import fs from 'fs-extra';

import { File, ContentType } from '@zougui/common.fs';

import { FileProcessingResult } from './types';
import { FileOptimizer } from '../../../../utils';
import env from '../../../../env';

export const processPreview = async (tempFile: string): Promise<FileProcessingResult> => {
  const contentType = await new File(tempFile).metadata.getContentType({
    analyzeBuffer: true,
    strict: true,
  });

  if (contentType !== ContentType.StaticImage) {
    throw new Error(`Previews can only be a static image. Got: ${contentType}`);
  }

  const tempSampleDir = path.join(path.dirname(tempFile), 'samples');

  await fs.ensureDir(tempSampleDir);
  const result = await new FileOptimizer(tempFile)
    .resize(env.processing.preview.resize)
    .jpeg(env.processing.preview.jpeg)
    .webp(env.processing.preview.webp)
    .avif(env.processing.preview.avif)
    .toFile({ dir: tempSampleDir });

// should not happen; for type safety
if (!result.jpeg || !result.webp || !result.avif) {
  throw new Error('Could not create samples');
}

  return {
    original: result.jpeg.file,
    samples: [result.webp.file, result.avif.file],
  };
}
