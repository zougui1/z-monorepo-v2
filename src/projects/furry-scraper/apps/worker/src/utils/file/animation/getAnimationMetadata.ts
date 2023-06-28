import fs from 'fs-extra';

import { getVideoMetadata } from './getVideoMetadata';

export const getAnimationMetadata = async (path: string): Promise<AnimationMetadata> => {
  const [stat, metadata] = await Promise.all([
    fs.stat(path),
    getVideoMetadata(path),
  ]);

  return {
    path,
    size: stat.size,
    // TODO get these values (.apng, .gif, .webp, videos)
    width: metadata.width ?? -1,
    height: metadata.height ?? -1,
    frameRate: metadata.frameRate ?? -1,
    frameCount: metadata.frameCount ?? -1,
    duration: metadata.duration ?? -1,
  };
}

export interface AnimationMetadata {
  path: string;
  size: number;
  width: number;
  height: number;
  frameCount: number;
  frameRate: number;
  duration: number;
}
