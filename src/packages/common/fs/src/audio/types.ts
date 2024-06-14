import { File } from '../file';

export interface AudioMetadataObject {
  duration: number;
}

export interface FileMetadataObject extends File.MetadataObject, AudioMetadataObject {}
