import type { Character } from '~/database';

export interface CharacterData extends Character {
  _id: string;
}
