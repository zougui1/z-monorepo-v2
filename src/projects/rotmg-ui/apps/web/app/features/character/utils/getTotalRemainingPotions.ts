import { sum } from 'radash';

import type { Character, PotionsRemaining } from '~/api/characters';

export const getTotalRemainingPotions = (characters: Character[]): PotionsRemaining => {
  return {
    life: sum(characters, character => character.potionsRemaining.life),
    mana: sum(characters, character => character.potionsRemaining.mana),
    attack: sum(characters, character => character.potionsRemaining.attack),
    defense: sum(characters, character => character.potionsRemaining.defense),
    speed: sum(characters, character => character.potionsRemaining.speed),
    dexterity: sum(characters, character => character.potionsRemaining.dexterity),
    vitality: sum(characters, character => character.potionsRemaining.vitality),
    wisdom: sum(characters, character => character.potionsRemaining.wisdom),
  };
}
