import * as audio from './AudioFile';
import * as metadata from './AudioMetadata';
import { audioMetadataKeys } from './audioMetadataKeys';
import * as types from './types';

export namespace AudioFile {
  export const Object = audio.AudioFile;
  export type Object = audio.AudioFile;

  export const AudioMetadata = metadata.AudioMetadata;
  export type AudioMetadata = metadata.AudioMetadata;

  export const metadataKeys = audioMetadataKeys;

  export type MetadataObject = types.FileMetadataObject;
}
