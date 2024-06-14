import { getAsciiWords } from './getAsciiWords';

const reAlphaNumeric = /[a-zA-Z0-9]/;

export const splitWords = (text: string): string[] => {
  return getAsciiWords(text).filter(word => reAlphaNumeric.test(word));
}
