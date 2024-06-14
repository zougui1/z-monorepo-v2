import fs from 'fs-extra';

import { getEnv } from '~/env';

import { dataSchema, type Data } from './schema';

export const getData = async (): Promise<Data> => {
  const data = await fs.readJson(getEnv().resourceFilePath);
  return dataSchema.parse(data);
}
