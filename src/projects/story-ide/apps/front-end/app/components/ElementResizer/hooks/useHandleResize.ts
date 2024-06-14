import { useWindowEvent } from 'app/hooks';

import type { Handle } from './useActiveHandle';
import { getBounds } from '../utils';
import type { Position } from '../enums';
import type { NewBounds } from '../types';

export const useHandleResize = (
  ref: React.RefObject<HTMLElement | null>,
  handle: React.RefObject<Handle | null>,
  options: UseHandleResizeOptions,
) => {
  const {
    enabledHandles,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    onChange,
  } = options;

  useWindowEvent('mousemove', e => {
    if (!handle.current || !ref.current) {
      return;
    }

    const bounds = getBounds(ref.current, {
      ...handle.current,
      enabledHandles,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      clientX: e.clientX,
      clientY: e.clientY,
    });

    onChange(bounds);
  }, [enabledHandles, minWidth, minHeight, maxWidth, maxHeight]);
}

export interface UseHandleResizeOptions {
  onChange: (bounds: NewBounds) => void;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  enabledHandles: Position[];
}
