import { File } from '../file';

export interface AnimationMetadataObject {
  width: number;
  height: number;
  duration: number;
  frameCount: number;
  frameRate: number;
}

export interface FileMetadataObject extends File.MetadataObject, AnimationMetadataObject {}
