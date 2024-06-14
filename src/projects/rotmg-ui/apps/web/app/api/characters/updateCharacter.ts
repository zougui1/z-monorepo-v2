import { getCharacters } from './getCharacters';
import { updateCharacters } from './internal';
import type { Character } from './schema';

export const updateCharacter = async (id: string, newCharacterData: Omit<Character, 'id' | 'className'>): Promise<void> => {
  const characters = await getCharacters();
  const newCharacters = characters.map(character => {
    if (id !== character.id) {
      return character;
    }

    const newLabel = newCharacterData.label === '' ? undefined : newCharacterData.label

    return {
      ...character,
      ...newCharacterData,
      label: newLabel,
    };
  });

  await updateCharacters(newCharacters);
}
