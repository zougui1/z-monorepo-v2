/*import { prop, getModelForClass } from '@typegoose/typegoose';

import { Class } from '~/game/enums';

import type { TypegooseDocument } from '../types';

export class Character {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true })
  picture!: string;

  @prop({ enum: Class, required: true })
  class!: Class;

  @prop({ min: 1, max: 100, required: true })
  level!: number;

  @prop({ min: 0, max: 1000, required: true })
  maxHp!: number;

  @prop({ min: 0, max: 1000, required: true })
  hp!: number;

  @prop({ min: 0, max: 1000, required: true })
  maxMp!: number;

  @prop({ min: 0, max: 1000, required: true })
  mp!: number;

  @prop({ min: 0, max: 1000, required: true })
  strength!: number;

  @prop({ min: 0, max: 1000, required: true })
  resilience!: number;

  @prop({ min: 0, max: 1000, required: true })
  agility!: number;

  @prop({ min: 0, max: 1000, required: true })
  deftness!: number;

  @prop({ min: 0, max: 1000, required: true })
  magicalMight!: number;

  @prop({ min: 0, max: 1000, required: true })
  magicalMending!: number;

  @prop({ min: 0, required: true })
  experience!: number;
}

export const CharacterModel = getModelForClass(Character);
export type CharacterDocument = TypegooseDocument<Character>;
export type CharacterObject = Character & { _id: string };
*/
