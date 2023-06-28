import { AudioMetadataObject } from '../types';
import { ffprobe } from '../../utils';

export const getAudioMetadata = async (filePath: string): Promise<AudioMetadataObject> => {
  const data = await ffprobe(filePath, {
    selectSreams: 'a:0',
    showEntries: ['duration'],
  });

  const duration = Number(data.duration);

  if (!duration) {
    throw new Error('Could not find audio metadata');
  }

  return { duration };
}
