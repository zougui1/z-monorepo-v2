import { readText } from '@zougui/common.extract-text';
import { splitWords } from '@zougui/common.string-utils';

export const countWords = async (file: string): Promise<number> => {
  const text = await readText(file);
  return splitWords(text).length;
}
