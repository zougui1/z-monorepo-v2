import execa from 'execa';

export const ffprobe = async (filePath: string, options: FfprobeOptions): Promise<Record<string, string | undefined>> => {
  const executable = process.env.FFPROBE_EXEC || 'ffprobe';
  const { stdout } = await execa(executable, getArgs(filePath, options), {
    windowsHide: true,
  });

  return parseOutput(stdout);
}

const getArgs = (filePath: string, options: FfprobeOptions): string[] => {
  const args: string[] = [
    filePath,
    '-v', options.logLevel || 'error',
    '-select_streams', options.selectSreams,
    '-show_entries', `stream=${options.showEntries.join(',')}`,
  ];

  if (options.countFrames) {
    args.push('-count_frames');
  }

  return args;
}

const parseOutput = (output: string): Record<string, string | undefined> => {
  return output
    .split('\n')
    .filter(l => l !== '')
    .reduce((acc, line) => {
      const [key, value = ''] = line.split('=');
      acc[key] = value.trim();

      return acc;
    }, {} as Record<string, string>);
}

export interface FfprobeOptions {
  logLevel?: string | undefined;
  selectSreams: string;
  showEntries: string[];
  countFrames?: boolean | undefined;
}
