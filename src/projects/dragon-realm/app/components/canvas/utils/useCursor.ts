import { useState } from 'react';
import { useCursor as useDreiCursor } from '@react-three/drei';

export const useCursor = (options?: UseCursorOptions) => {
  const [hovered, setHovered] = useState(false);

  useDreiCursor(
    hovered && options?.disabled !== true,
    options?.pointerIn,
    options?.pointerOut,
  );

  return {
    enter: () => setHovered(true),
    leave: () => setHovered(false),
  };
}

export interface UseCursorOptions {
  disabled?: boolean;
  pointerIn?: string;
  pointerOut?: string;
}
