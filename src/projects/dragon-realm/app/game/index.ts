import { character } from './character';
import { location } from './location';
import { area } from './area';

export const game = {
  character,
  location,
  area,
};

export * from './Game';
export * from './GameEventMap';
export type * from './area';
export type * from './types';
