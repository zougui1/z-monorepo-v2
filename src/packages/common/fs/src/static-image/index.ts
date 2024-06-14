import * as staticImage from './StaticImageFile';
import * as metadata from './StaticImageMetadata';
import { staticImageMetadataKeys } from './staticImageMetadataKeys';
import * as types from './types';

export namespace StaticImageFile {
  export const Object = staticImage.StaticImageFile;
  export type Object = staticImage.StaticImageFile;

  export const StaticImageMetadata = metadata.StaticImageMetadata;
  export type StaticImageMetadata = metadata.StaticImageMetadata;

  export const metadataKeys = staticImageMetadataKeys;

  export type MetadataObject = types.FileMetadataObject;
}
