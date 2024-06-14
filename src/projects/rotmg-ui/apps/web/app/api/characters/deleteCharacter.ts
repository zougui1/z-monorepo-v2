import { getCharacters } from './getCharacters';
import { updateCharacters } from './internal';

export const deleteCharacter = async (characterId: string): Promise<void> => {
  const characters = await getCharacters();
  const newCharacters = characters.filter(character => character.id !== characterId);

  await updateCharacters(newCharacters);
}
