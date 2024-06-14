import path from 'node:path';

import { Command } from 'commander';
import { isNumber } from 'radash';

import { VideoTimestamp } from './utils';

const defaultSpeed = 2;

const program = new Command();

const validateTimestamp = (value: string): VideoTimestamp.Type => {
  if (!VideoTimestamp.isTimestampLike(value)) {
    throw new Error('Invalid timestamp');
  }

  return VideoTimestamp.getValid(value);
}

const validateSection = (value: string, prev: [start: VideoTimestamp.Type, end: VideoTimestamp.Type][] = []): [start: VideoTimestamp.Type, end: VideoTimestamp.Type][] => {
  const [startString, endString] = value.split('-');

  if (!endString) {
    throw new Error('Missing end timestamp of section');
  }

  if (!VideoTimestamp.isTimestampLike(startString)) {
    throw new Error('Invalid start timestamp');
  }

  if (!VideoTimestamp.isTimestampLike(endString)) {
    throw new Error('Invalid end timestamp');
  }

  return [...prev, [VideoTimestamp.getValid(startString), VideoTimestamp.getValid(endString)]];
}

program.name('zvideo').description('video utilities');

program
  .command('trim')
  .description('trim a video')
  .argument('<path>', 'path to the video')
  .option('-s, --start <timestamp>', 'start time in video timestamp format', validateTimestamp)
  .option('-e, --end <timestamp>', 'end time in video timestamp format', validateTimestamp)
  .option('--suffix <string>', 'suffix to add to the output filename')
  .option('-f, --format <string>', 'format of the video to be output', 'mp4')
  .option('--reenc', 'reencode the video')
  .option('--speed [speed]', `multiplier for the speed of the video (default if true: ${defaultSpeed})`)
  .option('-a, --keep-audio', 'keep the audio')
  .action(async (dirtyFilePath, options) => {
    const { trim } = await import('./commands/trim');

    const speed = options.speed === true
      ? defaultSpeed
      : Number(options.speed);

    if (speed && !isNumber(speed)) {
      throw new Error('speed must be a number');
    }

    if (speed <= 0) {
      throw new Error('speed must be greater than 0');
    }

    const filePath = path.resolve(process.cwd(), dirtyFilePath);

    await trim({
      speed,
      filePath: filePath,
      start: options.start || '00:00:00',
      end: options.end,
      suffix: options.suffix,
      format: options.format,
      reenc: options.reenc,
      keepAudio: options.keepAudio,
    });
  });

program
  .command('concat')
  .description('concatenate multiple videos')
  .option('-i, --input <paths...>', 'paths to the video')
  .option('--suffix <string>', 'suffix to add to the output filename')
  .option('-f, --format <string>', 'format of the video to be output', 'mp4')
  .option('-a, --keep-audio', 'keep the audio')
  .action(async (options) => {
    const { concat } = await import('./commands/concat');

    console.log(options);

    const filePaths = options.input.map((input: string) => {
      return path.resolve(process.cwd(), input);
    });

    await concat({
      filePaths,
      suffix: options.suffix,
      format: options.format,
      keepAudio: options.keepAudio,
    });
  });

program
  .command('sections')
  .description('trim parts of a video and concatenate them together')
  .argument('<path>', 'path to the video')
  .option('-s, --section <timestamp-range...>', 'start time in video timestamp format', validateSection)
  .option('--suffix <string>', 'suffix to add to the output filename')
  .option('-f, --format <string>', 'format of the video to be output', 'mp4')
  .option('--speed [speed]', `multiplier for the speed of the video (default if true: ${defaultSpeed})`)
  .option('-a, --keep-audio', 'keep the audio')
  .action(async (dirtyFilePath, options) => {
    const { sections } = await import('./commands/sections');

    console.log(options.section)

    const speed = options.speed === true
      ? defaultSpeed
      : Number(options.speed);

    if (speed && !isNumber(speed)) {
      throw new Error('speed must be a number');
    }

    if (speed <= 0) {
      throw new Error('speed must be greater than 0');
    }

    const filePath = path.resolve(process.cwd(), dirtyFilePath);

    await sections({
      speed,
      filePath: filePath,
      sections: options.section,
      suffix: options.suffix,
      format: options.format,
      keepAudio: options.keepAudio,
    });
  });

program.parseAsync()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
