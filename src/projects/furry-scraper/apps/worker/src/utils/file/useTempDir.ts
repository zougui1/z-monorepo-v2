import path from 'node:path';

import fs from 'fs-extra';
import { nanoid } from 'nanoid';

export const useTempDir = async <T>(dir: string, action: TempDirAction<T>): Promise<T> => {
  const name = nanoid();
  const tempDir = path.join(dir, name);

  try {
    await fs.ensureDir(tempDir);
    return await action(tempDir, name);
  } finally {
    await fs.remove(tempDir);
  }
}

type TempDirAction<T> = (tempDir: string, dirName: string) => Promise<T>;
