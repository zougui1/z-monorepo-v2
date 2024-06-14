import sharp from 'sharp';

import { StaticImageMetadataObject } from '../types';

export const getStaticImageMetadata = async (filePath: string): Promise<StaticImageMetadataObject> => {
  const metadata = await sharp(filePath).metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error('Size not found for image');
  }

  return {
    width,
    height,
  };
}
