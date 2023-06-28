import imgHash from 'imghash';

import { File, ContentType } from '@zougui/common.fs';

const hasherMap: Map<ContentType, (file: string, bitSize?: number | undefined) => Promise<string>> = new Map([
  [ContentType.StaticImage, imgHash.hash],
]);

export const getSimilarityHash = async (file: string, bitSize?: number | undefined): Promise<string | undefined> => {
  const contentType = await new File(file).metadata.getContentType({ strict: true });
  const hash = hasherMap.get(contentType);

  return await hash?.(file, bitSize);
}
