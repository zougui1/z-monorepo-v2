import { VideoMetadataObject } from './types';

export const videoMetadataKeys: ReadonlyArray<keyof VideoMetadataObject> = [
  'width',
  'height',
  'duration',
  'frameCount',
  'frameRate',
];
