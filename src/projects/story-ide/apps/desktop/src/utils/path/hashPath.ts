import crypto from 'node:crypto';

import { removeSuffix } from '@zougui/common.string-utils';

export const hashPath = (path: string): string => {
  const cleanPath = removeSuffix(path, '/');
  return crypto.createHash('sha256').update(cleanPath).digest('hex');
}
