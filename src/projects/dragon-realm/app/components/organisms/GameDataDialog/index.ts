import {
  GameDataDialogRoot,
  type GameDataDialogRootProps,
} from './GameDataDialogRoot';
import {
  GameDataDialogFieldset,
  type GameDataDialogFieldsetProps,
} from './GameDataDialogFieldset';
import {
  GameDataDialogTable,
  type GameDataDialogTableProps,
} from './GameDataDialogTable';

export const GameDataDialog = {
  Root: GameDataDialogRoot,
  Fieldset: GameDataDialogFieldset,
  Table: GameDataDialogTable,
};

export type {
  GameDataDialogRootProps,
  GameDataDialogFieldsetProps,
  GameDataDialogTableProps,
};
