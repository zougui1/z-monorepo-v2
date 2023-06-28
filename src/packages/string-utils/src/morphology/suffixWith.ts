export const suffixWith = (str: string, prefix: string): string => {
  return str.endsWith(prefix) ? str : `${str}${prefix}`;
}
