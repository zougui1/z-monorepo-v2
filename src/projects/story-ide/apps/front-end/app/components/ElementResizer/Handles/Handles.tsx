import { memo } from 'react';
import { unique } from 'radash';

import { Handle } from '../Handle';
import type { Position } from '../enums';

export const Handles = memo(function HandlesMemo({ handles, onMouseDown, onMouseLeave, onMouseMove, disabled }: HandlesProps) {
  return (
    <>
      {unique(handles).map(handle => (
        <Handle
          key={handle}
          position={handle}
          disabled={disabled}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </>
  );
});

export interface HandlesProps {
  handles: Position[];
  disabled?: boolean | undefined;
  onMouseDown: (e: React.MouseEvent, position: Position) => void;
  onMouseMove: (e: React.MouseEvent, position: Position) => void;
  onMouseLeave: (e: React.MouseEvent, position: Position) => void;
}
