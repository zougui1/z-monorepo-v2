import { AnimationMetadataObject } from '../types';
import { getVideoMetadata } from '../../video/utils';
import { getAnimatedImageMetadata } from '../../utils';
import { FileType } from '../../enums';
import { Extension } from '../../types';

const getMetadataMap: Partial<Record<FileType, GetAnimatedMetadata>> = {
  video: getVideoMetadata,
  image: getAnimatedImageMetadata,
};

export const getAnimationMetadata = async (filePath: string, options: GetAnimationMetadataOptions): Promise<AnimationMetadataObject> => {
  const getMetadata = getMetadataMap[options.fileType];

  if (!getMetadata) {
    throw new Error(`The following file-type is not an animation: ${options.fileType}`);
  }

  return await getMetadata(filePath, options.extension);
}

export type AnimatedFileType = FileType.Image | FileType.Video;
type GetAnimatedMetadata = (filePath: string, extension: Extension) => Promise<AnimationMetadataObject>

export interface GetAnimationMetadataOptions {
  fileType: FileType;
  extension: Extension;
}
