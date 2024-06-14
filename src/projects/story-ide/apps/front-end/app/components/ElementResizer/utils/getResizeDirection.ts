import { includesAll } from 'app/utils';

import { Position, Direction } from '../enums';

const bottomLeft = [Position.Bottom, Position.Left];
const bottomRight = [Position.Bottom, Position.Right];
const topLeft = [Position.Top, Position.Left];
const topRight = [Position.Top, Position.Right];

export const getResizeDirection = (element: HTMLElement, options: GetResizeDirectionOptions): Direction => {
  const { clientX, clientY, handle, enabledHandles, diagonalOffset } = options;
  const rect = element.getBoundingClientRect();

  const isOnTop = clientY <= (rect.y + diagonalOffset);
  const isOnLeft = clientX <= (rect.x + diagonalOffset);
  const isOnBottom = clientY >= (rect.y + rect.height - diagonalOffset);
  const isOnRight = clientX >= (rect.x + rect.width - diagonalOffset);

  if (includesAll(enabledHandles, bottomLeft) && ((handle === Position.Left && isOnBottom) || (handle === Position.Bottom && isOnLeft))) {
    return Direction.BottomLeft;
  }

  if (includesAll(enabledHandles, bottomRight) && ((handle === Position.Right && isOnBottom) || (handle === Position.Bottom && isOnRight))) {
    return Direction.BottomRight;
  }

  if (includesAll(enabledHandles, topLeft) && ((handle === Position.Left && isOnTop) || (handle === Position.Top && isOnLeft))) {
    return Direction.TopLeft;
  }

  if (includesAll(enabledHandles, topRight) && ((handle === Position.Right && isOnTop) || (handle === Position.Top && isOnRight))) {
    return Direction.TopRight;
  }

  return Direction[handle];
}

export interface GetResizeDirectionOptions {
  clientX: number;
  clientY: number;
  handle: Position;
  enabledHandles: Position[];
  diagonalOffset: number;
}
