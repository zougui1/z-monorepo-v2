import { maxLength } from './constants';

export const checkLength = (str: string): void => {
  if (str.length > maxLength) {
    throw new Error(`Value exceeds the maximum length of ${maxLength} characters.`);
  }
}
