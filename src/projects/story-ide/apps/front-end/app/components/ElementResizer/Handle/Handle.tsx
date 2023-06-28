import clsx from 'clsx';

import { classes, styles } from './Handle.styles';
import type { Position } from '../enums';

const axis: Record<Position, 'horizontal' | 'vertical'> = {
  Top: 'horizontal',
  Left: 'vertical',
  Bottom: 'horizontal',
  Right: 'vertical',
};

export const Handle = (props: HandleProps) => {
  const { position, disabled, onMouseDown, onMouseMove, onMouseLeave } = props;

  const axisStyle = styles[axis[position]];
  const axisClass = classes[axis[position]];
  const positionClass = classes[position];

  const handleMouseEvent = (handler: (e: React.MouseEvent, position: Position) => void): React.MouseEventHandler | undefined => {
    if (disabled) {
      return;
    }

    return (e: React.MouseEvent) => handler(e, position);
  }

  return (
    <div
      className={clsx('bg-red-600 z-10 absolute select-none', axisClass, positionClass)}
      style={axisStyle}
      onMouseDown={handleMouseEvent(onMouseDown)}
      onMouseMove={handleMouseEvent(onMouseMove)}
      onMouseLeave={handleMouseEvent(onMouseLeave)}
    />
  );
}

export interface HandleProps {
  position: Position;
  disabled?: boolean | undefined;
  onMouseDown: (e: React.MouseEvent, position: Position) => void;
  onMouseMove: (e: React.MouseEvent, position: Position) => void;
  onMouseLeave: (e: React.MouseEvent, position: Position) => void;
}
