import fs from 'fs-extra';

import { getEnv } from '~/env';

import { classesSchema, type Classes } from './schema';

export const getClasses = async (): Promise<Classes> => {
  const data = await fs.readJson(getEnv().classesFilePath);
  return classesSchema.parse(data);
}
