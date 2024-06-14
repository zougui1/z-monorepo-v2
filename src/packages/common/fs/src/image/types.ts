import { File } from '../file';

export interface ImageMetadataObject {
  width: number;
  height: number;
  duration?: number | undefined;
  frameCount?: number | undefined;
  frameRate?: number | undefined;
}

export interface FileMetadataObject extends File.MetadataObject, ImageMetadataObject {}
