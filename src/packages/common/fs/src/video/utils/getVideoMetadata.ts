import { VideoMetadataObject, FileMetadataObject } from '../types';
import { ffprobe } from '../../utils';

// TODO only get the metadata of the wanted fields
export const getVideoMetadata = async (filePath: string, fields?: (keyof FileMetadataObject)[] | undefined): Promise<VideoMetadataObject> => {
  const data = await ffprobe(filePath, {
    selectSreams: 'v:0',
    countFrames: true,
    showEntries: [
      'width',
      'height',
      'duration',
      'codec_type',
      'codec_name',
      'codec_long_name',
      'bit_rate',
      'size',
      'display_aspect_ratio',
      'r_frame_rate',
      'nb_read_frames',
    ],
  });

  const [dirtyFrameRate, dirtyDivider] = data.r_frame_rate
    ?.split('/')
    .map(Number) || [];

  const width = Number(data.width);
  const height = Number(data.height);
  const duration = Number(data.duration);
  const frameCount = Number(data.nb_read_frames);
  // divider or 1 in case the divider is 0, to avoid the process from throwing an error
  const frameRate = (dirtyFrameRate / (dirtyDivider || 1)) || undefined;

  if (!width || !height || !duration || !frameCount || !frameRate) {
    throw new Error('Could not find video metadata');
  }

  return {
    width,
    height,
    duration,
    frameCount,
    frameRate,
  };
}
