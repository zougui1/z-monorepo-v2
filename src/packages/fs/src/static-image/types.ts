import { File } from '../file';

export interface StaticImageMetadataObject {
  width: number;
  height: number;
}

export interface FileMetadataObject extends File.MetadataObject, StaticImageMetadataObject {}
