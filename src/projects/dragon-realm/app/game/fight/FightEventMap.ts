import type { GameMenu } from '../types';

export interface FightEventMap {
  menu: GameMenu;
  finish: { win: boolean };
  stateChange: never;
}
