export const getFileName = (path: string): string => {
  return path.split('/').at(-1) ?? '';
}
