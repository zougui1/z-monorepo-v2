import type { Handle } from './useActiveHandle';
import { createGetResizeDirection } from '../utils';
import type { Position } from '../enums';
import { resizeCursors } from '../resizeCursors';

export const useHandleMouseCursor = (
  ref: React.RefObject<HTMLElement | null>,
  handle: React.RefObject<Handle | null>,
  options: UseHandleMouseCursorOptions,
): UseHandleMouseCursorResult => {
  const getResizeDirection = createGetResizeDirection(options);

  const onMouseMove = (e: React.MouseEvent, position: Position) => {
    if (!ref.current || handle.current) {
      return;
    }

    const direction = getResizeDirection(ref.current, e, position);
    document.body.style.cursor = resizeCursors[direction];
  }

  const onMouseLeave = () => {
    if (handle.current) {
      return;
    }

    document.body.style.cursor = 'unset';
  }

  return {
    onMouseLeave,
    onMouseMove,
  };
}

export interface UseHandleMouseCursorOptions {
  enabledHandles: Position[];
  diagonalOffset: number;
  diagonalsDisabled?: boolean | undefined;
}

export interface UseHandleMouseCursorResult {
  onMouseMove: (e: React.MouseEvent, position: Position) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}
