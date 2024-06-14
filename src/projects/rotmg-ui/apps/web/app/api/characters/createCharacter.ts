import { nanoid } from 'nanoid';

import type { ClassName } from '~/data/classes';

import { getCharacters } from './getCharacters';
import { updateCharacters } from './internal';
import type { Character } from './schema';

export const createCharacter = async (className: ClassName, options: CreateCharacterOptions = {}): Promise<void> => {
  const { startStat = 0 } = options;

  const characters = await getCharacters();
  const newCharacter: Character = {
    id: nanoid(),
    className,
    isSeasonal: true,
    potionsRemaining: {
      life: startStat,
      mana: startStat,
      attack: startStat,
      defense: startStat,
      speed: startStat,
      dexterity: startStat,
      vitality: startStat,
      wisdom: startStat,
    },
  };

  await updateCharacters([newCharacter, ...characters]);
}

export interface CreateCharacterOptions {
  startStat?: number;
}
