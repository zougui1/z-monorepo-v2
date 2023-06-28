export const dirname = (path: string): string => {
  // return a slash when the string is empty
  return path.split('/').slice(0, -1).join('/') || '/';
}
