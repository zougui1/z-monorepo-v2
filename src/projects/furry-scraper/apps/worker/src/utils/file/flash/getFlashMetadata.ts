import fs from 'fs-extra';

export const getFlashMetadata = async (path: string): Promise<FlashMetadata> => {
  const stat = await fs.stat(path);

  return {
    path,
    size: stat.size,
  };
}

export interface FlashMetadata {
  path: string;
  size: number;
}
