import path from 'node:path';

import fs from 'fs-extra';

export const moveToDir = async (file: string, dir: string): Promise<string> => {
  const fileName = path.basename(file);
  const destination = path.join(dir, fileName);
  await fs.rename(file, destination);

  return destination;
}
