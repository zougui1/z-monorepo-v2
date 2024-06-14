import fs from 'fs-extra';
import { DateTime } from 'luxon';
import prettyBytes from 'pretty-bytes';

import { MetadataObject } from '../IMetadata';

export const getFileMetadata = async (filePath: string): Promise<MetadataObject> => {
  const stats = await fs.stat(filePath);

  return {
    ...stats,
    atime: DateTime.fromMillis(stats.atimeMs),
    birthtime: DateTime.fromMillis(stats.birthtimeMs),
    ctime: DateTime.fromMillis(stats.ctimeMs),
    mtime: DateTime.fromMillis(stats.mtimeMs),
    bytes: prettyBytes(stats.size),
  };
}
