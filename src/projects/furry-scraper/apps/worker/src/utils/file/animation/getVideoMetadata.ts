import execa from 'execa';

/**
 * This contains information about the encoding of the video file
 */
interface CodecType {
  name?: string | undefined;
  type?: string | undefined;
  longName?: string | undefined;}

/**
 * This represents the extracted data from a video-file
 */
interface VideoMetadata {
  codec: CodecType;
  width?: number | undefined;
  height?: number | undefined;
  aspectRatio?: string | undefined;
  frameRate?: number | undefined;
  frameCount?: number | undefined;
  bitRate?: number | undefined;
  duration?: number | undefined;
}

/**
 * Returns the Video-MetaData of a local file
 * @param {String} videoFile Path to local file
 * @throws {Error} Will get thrown if file does not exist, ffmpeg/ffprobe is missing or can not be read
 * @returns {VideoMetadata} Metadata of the local video-file
 */
export const getVideoMetadata = async (videoFile: string): Promise<VideoMetadata> => {
  const executable: string = process.env.FFPROBE_EXEC || 'ffprobe';
  const { stdout } = await execa(executable, [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-count_frames',
    '-show_entries',
    'stream=width,height,duration,codec_type,codec_name,codec_long_name,bit_rate,size,display_aspect_ratio,r_frame_rate,nb_read_frames',
    videoFile,
  ], { windowsHide: true });

  const data = stdout
    .split('\n')
    .filter(l => l !== '')
    .reduce((acc, line) => {
      const [key, value = ''] = line.split('=');
      acc[key] = value.trim();

      return acc;
    }, {} as Record<string, string>);

  const [frameRate, divider] = data.r_frame_rate?.split('/').map(Number) || [];

  return {
    codec: {
      name: data.codec_name,
      longName: data.codec_long_name,
      type: data.codec_type,
    },
    aspectRatio: data.display_aspect_ratio,
    // if NaN then undefined
    width: Number(data.width) || undefined,
    height: Number(data.height) || undefined,
    // divider or one in case the divider is 0, to avoid the process from throwing an error
    frameRate: (frameRate / (divider || 1)) || undefined,
    frameCount: Number(data.nb_read_frames) || undefined,
    bitRate: Number(data.bit_rate) || undefined,
    duration: Number(data.duration) || undefined,
  };
}
