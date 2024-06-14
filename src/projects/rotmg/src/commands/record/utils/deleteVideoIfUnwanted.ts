import path from 'node:path';

import fs from 'fs-extra';

import { checkIsVideoWanted } from './checkIsVideoWanted';

export const deleteVideoIfUnwanted = async (filePath: string): Promise<void> => {
  const isVideoWanted = await checkIsVideoWanted(filePath);

  if (!isVideoWanted) {
    await fs.remove(filePath);
    console.log(path.basename(filePath), 'has been deleted');
  }
}
