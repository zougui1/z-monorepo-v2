import { useActiveHandle, type UseActiveHandleResult } from './useActiveHandle';
import { useHandleMouseCursor, type UseHandleMouseCursorResult } from './useHandleMouseCursor';
import { useHandleResize } from './useHandleResize';
import type { Position } from '../enums';
import type { NewBounds } from '../types';

export const useHandle = (ref: React.RefObject<HTMLElement | null>, options: UseHandleOptions): UseHandleResult => {
  const {
    onChange,
    diagonalsDisabled,
    diagonalOffset,
    enabledHandles,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
  } = options;

  const { handle, ...activeHandleProps } = useActiveHandle(ref, {
    diagonalOffset,
    minHeight,
    minWidth,
    diagonalsDisabled,
    enabledHandles,
  });

  const mouseCursorHandlers = useHandleMouseCursor(ref, handle, {
    diagonalOffset,
    diagonalsDisabled,
    enabledHandles,
  });

  useHandleResize(ref, handle, {
    enabledHandles,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    onChange,
  });

  return {
    ...activeHandleProps,
    ...mouseCursorHandlers,
  };
}

export interface UseHandleOptions {
  onChange: (bounds: NewBounds) => void;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  enabledHandles: Position[];
  diagonalOffset: number;
  diagonalsDisabled?: boolean | undefined;
}

export interface UseHandleResult extends Omit<UseActiveHandleResult, 'handle'>, UseHandleMouseCursorResult {}
