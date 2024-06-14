import fs from 'fs-extra';

import { getEnv } from '~/env';

import { charactersSchema, type Character } from './schema';

export const getCharacters = async (): Promise<Character[]> => {
  const data = await fs.readJson(getEnv().charactersFilePath);
  return charactersSchema.parse(data);
}
