import { ImageMetadataObject } from './types';

export const imageMetadataKeys: ReadonlyArray<keyof ImageMetadataObject> = [
  'width',
  'height',
  'duration',
  'frameCount',
  'frameRate',
];
