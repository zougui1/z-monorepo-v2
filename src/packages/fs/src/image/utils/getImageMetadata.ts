import sharp from 'sharp';

import { ImageMetadataObject } from '../types';
import { computeAnimatedImageMetadata } from '../../utils';

export const getImageMetadata = async (filePath: string): Promise<ImageMetadataObject> => {
  const metadata = await sharp(filePath).metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error('Size not found for image');
  }

  const animationMetadata = computeAnimatedImageMetadata(metadata);

  return {
    width,
    height,
    ...animationMetadata,
  };
}
