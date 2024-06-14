import fs from 'fs-extra';

import { getEnv } from '~/env';

import { charactersSchema, type Character } from '../schema';

export const updateCharacters = async (characters: Character[]): Promise<void> => {
  const data = charactersSchema.safeParse(characters);

  if (!data.success) {
    return;
  }

  await fs.writeJson(getEnv().charactersFilePath, data.data, { spaces: 2 });
}
