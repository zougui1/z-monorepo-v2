export const removePrefix = (str: string, prefix: string): string => {
  return str.startsWith(prefix) ? str.slice(prefix.length, str.length) : str;
}
