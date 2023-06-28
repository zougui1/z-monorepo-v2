import type { Direction } from './enums';

export const resizeCursors: Readonly<Record<Direction, string>> = {
  Left: 'ew-resize',
  Right: 'ew-resize',
  Top: 'ns-resize',
  Bottom: 'ns-resize',
  BottomLeft: 'nesw-resize',
  TopLeft: 'nwse-resize',
  BottomRight: 'nwse-resize',
  TopRight: 'nesw-resize',
};
