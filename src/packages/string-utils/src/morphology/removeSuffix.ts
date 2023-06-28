export const removeSuffix = (str: string, prefix: string): string => {
  return str.endsWith(prefix) ? str.slice(0, -prefix.length) : str;
}
