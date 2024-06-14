import * as animation from './AnimationFile';
import * as metadata from './AnimationMetadata';
import { animationMetadataKeys } from './animationMetadataKeys';
import * as types from './types';

export namespace AnimationFile {
  export const Object = animation.AnimationFile;
  export type Object = animation.AnimationFile;

  export const AnimationMetadata = metadata.AnimationMetadata;
  export type AnimationMetadata = metadata.AnimationMetadata;

  export const metadataKeys = animationMetadataKeys;

  export type MetadataObject = types.FileMetadataObject;
}
