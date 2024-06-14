import { useRef } from 'react';

import { getBodyHasCursor } from 'app/utils';

export const useBodyCursor = () => {
  const ref = useRef({ didDefineCursor: false });

  const setCursor = (cursor: string): void => {
    if (!getBodyHasCursor()) {
      document.body.style.cursor = 'pointer';
    }
  }

  const resetCursor = (): void => {
    if (ref.current.didDefineCursor) {
      document.body.style.cursor = 'unset';
    }
  }

  return {
    set: setCursor,
    reset: resetCursor,
  };
}

export interface UseBodyCursorResult {
  set: (cursor: string) => void;
  reset: () => void;
}
