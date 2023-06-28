import fs from 'fs-extra';

import { countWords } from './countWords';

export const getTextMetadata = async (path: string): Promise<TextMetadata> => {
  const [stat, wordCount] = await Promise.all([
    fs.stat(path),
    countWords(path),
  ]);

  return {
    path,
    size: stat.size,
    wordCount,
  };
}

export interface TextMetadata {
  path: string;
  size: number;
  wordCount: number;
}
