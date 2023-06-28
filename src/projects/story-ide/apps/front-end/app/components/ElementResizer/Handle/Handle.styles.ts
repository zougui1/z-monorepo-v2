import { handleSize }  from '../constants';
import type { Position } from '../enums';

export const classes: Record<Position | 'horizontal' | 'vertical', string> = {
  horizontal: 'left-0 w-full',
  vertical: 'top-0 h-full',
  Left: 'left-0',
  Right: 'right-0',
  Top: 'top-0',
  Bottom: 'bottom-0',
};

export const styles: Record<'horizontal' | 'vertical', { width: number; } | { height: number; }> = {
  vertical: {
    width: handleSize,
  },

  horizontal: {
    height: handleSize,
  },
};
