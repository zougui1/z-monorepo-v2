import { getContentType, ContentType } from '@zougui/common.fs';

import { getAnimationMetadata } from './animation';
import { getAudioMetadata } from './audio';
import { getTextMetadata } from './text';
import { getFlashMetadata } from './flash';
import { getImageMetadata } from './static-image';

const metadataGetter = {
  staticImage: getImageMetadata,
  animation: getAnimationMetadata,
  audio: getAudioMetadata,
  text: getTextMetadata,
  flash: getFlashMetadata,
} satisfies Record<ContentType, (file: string) => Promise<FileMetadata>>;

export const getFileMetadata = async (file: string): Promise<FileMetadata> => {
  const contentType = await getContentType(file, { strict: true });
  const getMetadata = metadataGetter[contentType];

  return await getMetadata(file);
}

export interface FileMetadata {
  path: string;
  size: number;

  width?: number | undefined;
  height?: number | undefined;

  duration?: number | undefined;

  frameRate?: number | undefined;
  frameCount?: number | undefined;

  wordCount?: number | undefined;
}
