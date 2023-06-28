import { prefixWith, removePrefix, removeSuffix } from './morphology';

/**
 * join the strings together while making sure not to repeat the separator if already present
 * @param strings
 * @param separator
 */
export const join = (strings: string[], separator: string): string => {
  if (!strings.length) {
    return '';
  }

  const joinedString = strings
    .map(str => prefixWith(removeSuffix(str, separator), separator))
    .join('');

  // do not add the separator at the beginning when the first string does not start with it
  const startPreserved = strings[0].startsWith(separator)
    ? joinedString
    : removePrefix(joinedString, separator);

  // preserve the end separator if present
  const endPreserved = strings[strings.length - 1].endsWith(separator)
    ? `${startPreserved}${separator}`
    : startPreserved;

  return endPreserved;
}
