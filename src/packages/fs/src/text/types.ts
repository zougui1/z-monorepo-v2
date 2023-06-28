import { File } from '../file';

export interface TextMetadataObject {
  wordCount: number;
}

export interface FileMetadataObject extends File.MetadataObject, TextMetadataObject {}
