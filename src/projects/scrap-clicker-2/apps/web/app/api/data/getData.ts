import path from 'node:path';

import fs from 'fs-extra';

import { getEnv } from '~/env';

import { dataSchema, type Data } from './schema';

const defaultData: Data = {
  resources: {
    goldenScraps: '0',
    magnets: '0',
    starFragments: '0',
  },
  scrapyardV2: 0,
  stars: 10,
  targetStar: 11,
  achievements: {
    reducedStarCost: 0,
  },
};

export const getData = async (): Promise<Data> => {
  const { resourceFilePath } = getEnv();

  await fs.ensureDir(path.dirname(resourceFilePath));

  if (!(await fs.pathExists(resourceFilePath))) {
    await fs.writeJson(resourceFilePath, defaultData);
  }

  const data = await fs.readJson(resourceFilePath);
  return dataSchema.parse(data);
}
