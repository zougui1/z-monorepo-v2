import imgHash from 'imghash';

import { File, ContentType } from '@zougui/common.fs';

import { optimizeImage } from './optimizeImage';
import { FileProcessingResult } from './types';

const optimizerMap: Map<ContentType, (file: string) => Promise<FileProcessingResult>> = new Map([
  [ContentType.StaticImage, optimizeImage],
]);

export const optimizeFile = async (file: string): Promise<FileProcessingResult | undefined> => {
  const contentType = await new File(file).metadata.getContentType({ strict: true });
  const optimizer = optimizerMap.get(contentType);

  return await optimizer?.(file);
}
