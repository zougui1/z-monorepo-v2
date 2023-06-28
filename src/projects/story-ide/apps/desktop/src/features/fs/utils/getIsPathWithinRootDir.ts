import path from 'node:path';

import { normalizePath } from '../../../utils';

/**
 * returns whether the concatenation of `rootDir` and `subPath` is outside of `rootDir` (using '..' in the path)
 * @param rootDir
 * @param subbPath
 */
export const getIsPathWithinRootDir = (rootDir: string, subPath: string): boolean => {
  const node = normalizePath(path.join(rootDir, subPath));
  const normalizedRootDir = normalizePath(rootDir);

  return node === normalizedRootDir || node.startsWith(`${normalizedRootDir}/`);
}
