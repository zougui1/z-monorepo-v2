import * as video from './VideoFile';
import * as metadata from './VideoMetadata';
import { videoMetadataKeys } from './videoMetadataKeys';
import * as types from './types';

export namespace VideoFile {
  export const Object = video.VideoFile;
  export type Object = video.VideoFile;

  export const VideoMetadata = metadata.VideoMetadata;
  export type VideoMetadata = metadata.VideoMetadata;

  export const metadataKeys = videoMetadataKeys;

  export type MetadataObject = types.FileMetadataObject;
}
