import fs from 'fs-extra';
import { getAudioDurationInSeconds } from 'get-audio-duration';

export const getAudioMetadata = async (path: string): Promise<AudioMetadata> => {
  const [stat, duration] = await Promise.all([
    fs.stat(path),
    getAudioDurationInSeconds(path),
  ]);

  return {
    path,
    size: stat.size,
    duration,
  };
}

export interface AudioMetadata {
  path: string;
  size: number;
  duration: number;
}
