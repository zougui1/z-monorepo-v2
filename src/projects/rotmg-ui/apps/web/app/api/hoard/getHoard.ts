import fs from 'fs-extra';

import { getEnv } from '~/env';

import { hoardSchema, type Hoard } from './schema';

export const getHoard = async (): Promise<Hoard> => {
  const data = await fs.readJson(getEnv().hoardFilePath);
  return hoardSchema.parse(data);
}
