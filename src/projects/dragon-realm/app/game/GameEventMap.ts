import type { VectorArray } from '~/types';

import type { GameDialogData, GameMenu } from './types';

export interface GameEventMap {
  stateChange: never;
  menu: GameMenu | undefined;
  dialog: GameDialogData | undefined;
  positionChange: VectorArray;
}
