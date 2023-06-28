import type { FS } from '@zougui/story-ide.types';

/**
 * sort order: directories > files
 * @param a
 * @param b
 * @returns
 */
export const sortNodes = (a: FS.Node, b: FS.Node): number => {
  if (a.type === 'dir' && b.type !== 'dir') {
    return -1;
  }

  if (a.type !== 'dir' && b.type === 'dir') {
    return 1;
  }

  return a.path.localeCompare(b.path, undefined, { numeric: true });
}
