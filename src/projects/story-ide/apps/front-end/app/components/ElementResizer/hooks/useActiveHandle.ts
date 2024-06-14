import { useRef } from 'react';

import { useWindowEvent } from 'app/hooks';

import { createGetResizeDirection } from '../utils';
import { resizeCursors } from '../resizeCursors';
import type { Position, Direction } from '../enums';

export const useActiveHandle = (ref: React.RefObject<HTMLElement | null>, options: UseActiveHandleOptions): UseActiveHandleResult => {
  const {
    diagonalOffset,
    enabledHandles,
    minHeight,
    minWidth,
    diagonalsDisabled,
  } = options;
  const handle = useRef<Handle | null>(null);

  const getResizeDirection = createGetResizeDirection({ diagonalOffset, diagonalsDisabled, enabledHandles });

  const onMouseDown = (e: React.MouseEvent, position: Position): void => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const direction = getResizeDirection(ref.current, e, position);

    handle.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: ref.current.clientWidth,
      startHeight: ref.current.clientHeight,
      maxLeft: rect.right - minWidth,
      maxTop: rect.bottom - minHeight,
    };
    //document.body.style.cursor = resizeCursors[direction];
  }

  useWindowEvent('mouseup', () => {
    // if the user has not clicked on a handle
    // then there is nothing to unset
    if (handle.current) {
      handle.current = null;
      document.body.style.cursor = 'unset';
    }
  });

  return {
    handle,
    onMouseDown,
  };
}

export interface UseActiveHandleOptions {
  enabledHandles: Position[];
  diagonalOffset: number;
  minWidth: number;
  minHeight: number;
  diagonalsDisabled?: boolean | undefined;
}

export interface UseActiveHandleResult {
  handle: React.RefObject<Handle | null>;
  onMouseDown: (e: React.MouseEvent, position: Position) => void;
}

export interface Handle {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  maxLeft: number;
  maxTop: number;
  direction: Direction;
}
