import fs from 'fs-extra';
import sharp from 'sharp';

export const getImageMetadata = async (path: string): Promise<ImageMetadata> => {
  const [stat, metadata] = await Promise.all([
    fs.stat(path),
    sharp(path).metadata(),
  ]);

  if (!metadata.width || !metadata.height) {
    throw new Error('Size not found for image');
  }

  return {
    path,
    size: stat.size,
    width: metadata.width,
    height: metadata.height,
  };
}

export interface ImageMetadata {
  path: string;
  size: number;
  width: number;
  height: number;
}
