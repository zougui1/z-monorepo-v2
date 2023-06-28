import * as text from './TextFile';
import * as metadata from './TextMetadata';
import { textMetadataKeys } from './textMetadataKeys';
import * as types from './types';

export namespace TextFile {
  export const Object = text.TextFile;
  export type Object = text.TextFile;

  export const TextMetadata = metadata.TextMetadata;
  export type TextMetadata = metadata.TextMetadata;

  export const metadataKeys = textMetadataKeys;

  export type MetadataObject = types.FileMetadataObject;
}
