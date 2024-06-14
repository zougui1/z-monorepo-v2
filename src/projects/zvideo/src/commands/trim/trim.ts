import execa from 'execa';

import { VideoFile, File } from '@zougui/common.fs';

import { VideoTimestamp } from '../../utils';
import { ffmpegExecutable } from '../../constants';

const getVideoDuration = async (filePath: string): Promise<number> => {
  const video = new VideoFile.Object(filePath);
  console.log('getting metadata...')
  const { duration } = await video.metadata.get({ fields: ['duration'] });
  console.log('got metadata')
  return duration;
}

export const trim = async (options: TrimOptions): Promise<string> => {
  const {
    filePath,
    start,
    reenc,
    keepAudio,
    speed,
  } = options;
  const file = new File.Definition(filePath);
  const suffix = options.suffix ? ` ${options.suffix}` : '';
  const outputExtension = options.format ? `.${options.format}` : file.extension;
  const output = `${file.withoutExtension.path} | trim${suffix}${outputExtension}`;
  const spedUpOutput = `${file.withoutExtension.path} | trim | speed ${suffix}${outputExtension}`;

  const end = options.end || VideoTimestamp.fromSeconds(await getVideoDuration(filePath));

  await execa(ffmpegExecutable, [
    '-i', filePath,
    '-ss', start,
    '-to', end,
    '-c:v', reenc ? 'h264' : 'copy',
    ...(keepAudio ? [] : ['-an']),
    output,
  ], {
    windowsHide: true,
    stdio: 'inherit',
  });

  if (speed && speed !== 1) {
    await execa(ffmpegExecutable, [
      '-i', output,
      '-filter:v', `setpts=${1 / speed}*PTS`,
      spedUpOutput,
    ], {
      windowsHide: true,
      stdio: 'inherit',
    });
  }

  return output;
}

export interface TrimOptions {
  filePath: string;
  start: VideoTimestamp.Type;
  end?: VideoTimestamp.Type | undefined;
  suffix?: string | undefined;
  format?: string | undefined;
  reenc?: boolean | undefined;
  speed?: number | undefined;
  keepAudio?: boolean | undefined;
}
