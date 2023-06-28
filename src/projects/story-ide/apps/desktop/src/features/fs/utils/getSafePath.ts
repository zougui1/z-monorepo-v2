import path from 'node:path';

import { Unauthorized } from 'http-errors';

import { getIsPathWithinRootDir } from './getIsPathWithinRootDir';
import { normalizePath } from '../../../utils';

/**
 * prevents unauthorized file access
 * @param rootDir
 * @param subbPath
 * @throws when the concatenation of `rootDir` and `subPath` is outside of `rootDir` (using '..' in the path)
 */
export const getSafePath = (rootDir: string, subbPath: string): string => {
  // prevent from retrieving files outside of `rootDir`
  if (!getIsPathWithinRootDir(rootDir, subbPath)) {
    throw new Unauthorized();
  }

  return normalizePath(path.join(rootDir, subbPath));
}
