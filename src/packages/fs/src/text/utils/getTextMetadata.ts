import { readText } from '@zougui/common.extract-text';
import { splitWords } from '@zougui/common.string-utils';

import { TextMetadataObject } from '../types';

export const getTextMetadata = async (filePath: string): Promise<TextMetadataObject> => {
  const text = await readText(filePath);
  const wordCount = splitWords(text).length;

  return { wordCount };
}
