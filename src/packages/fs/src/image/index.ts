import * as image from './ImageFile';
import * as metadata from './ImageMetadata';
import { imageMetadataKeys } from './imageMetadataKeys';
import * as types from './types';

export namespace ImageFile {
  export const Object = image.ImageFile;
  export type Object = image.ImageFile;

  export const ImageMetadata = metadata.ImageMetadata;
  export type ImageMetadata = metadata.ImageMetadata;

  export const metadataKeys = imageMetadataKeys;

  export type MetadataObject = types.FileMetadataObject;
}
