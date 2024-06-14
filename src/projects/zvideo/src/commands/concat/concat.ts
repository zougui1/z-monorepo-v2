import execa from 'execa';

import { File } from '@zougui/common.fs';

import { ffmpegExecutable } from '../../constants';

const reSuffix = /\|.*/;

const getConcatFlag = (filePaths: string[], withAudio?: boolean): string => {
  const composition = filePaths
    .flatMap((filePath, index) => [`[${index}:v]`, withAudio && `[${index}:a]`])
    .filter(Boolean)
    .join(' ');

  const parameters = [
    `n=${filePaths.length}`,
    'v=1',
    `a=${withAudio ? 1 : 0}`,
  ].join(':')

  return `${composition}concat=${parameters}[v]`;
}

export const concat = async (options: ConcatOptions): Promise<void> => {
  if (options.filePaths.length < 2) {
    throw new Error(`Expected at least 2 files to concat, got ${options.filePaths.length} instead`);
  }

  const lastFilePath = options.filePaths.at(-1);

  // this should never happen, just for type safety
  if (!lastFilePath) {
    throw new Error('Missing last file path');
  }

  const inputFlags = options.filePaths.flatMap(filePath => ['-i', filePath]);

  const file = new File.Definition(lastFilePath);
  const suffix = options.suffix ? ` ${options.suffix}` : '';
  const outputExtension = options.format ? `.${options.format}` : file.extension;
  const output = `${file.withoutExtension.path.replace(reSuffix, '').trim()} | concat${suffix}${outputExtension}`;

  await execa(ffmpegExecutable, [
    ...inputFlags,
    '-filter_complex', getConcatFlag(options.filePaths, options.keepAudio),
    '-map', '[v]',
    ...(options.keepAudio ? ['-map', '[a]'] : ['-an']),
    output,
  ], {
    windowsHide: true,
    stdio: 'inherit',
  });
}

export interface ConcatOptions {
  filePaths: string[];
  suffix?: string | undefined;
  format?: string | undefined;
  keepAudio?: boolean | undefined;
}
