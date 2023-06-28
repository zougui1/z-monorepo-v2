import { getResizeDirection } from './getResizeDirection';
import { Direction, type Position } from '../enums';

export const createGetResizeDirection = (options: CreateGetResizeDirectionOptions) => {
  const { diagonalOffset, enabledHandles, diagonalsDisabled } = options;

  return (element: HTMLElement, e: React.MouseEvent, handle: Position): Direction => {
    if (diagonalsDisabled) {
      return Direction[handle];
    }

    return getResizeDirection(element, {
      handle,
      diagonalOffset,
      enabledHandles,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  }
}

export interface CreateGetResizeDirectionOptions {
  enabledHandles: Position[];
  diagonalOffset: number;
  diagonalsDisabled?: boolean | undefined;
}
