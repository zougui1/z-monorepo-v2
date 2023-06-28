import { Position } from '../enums';
import { handleSize } from '../constants';

export const getContentOffsets = (handles: Position[]): ContentOffsets => {
  const widthOffset = getWidthOffset(handles) * handleSize;
  const heightOffset = getHeightOffset(handles) * handleSize;

  return {
    width: `calc(100% - ${widthOffset}px)`,
    height: `calc(100% - ${heightOffset}px)`,
    marginLeft: handles.includes(Position.Left) ? handleSize : 0,
    marginTop: handles.includes(Position.Top) ? handleSize : 0,
  };
}

const getWidthOffset = (handles: Position[]): number => {
  const hasLeft = handles.includes(Position.Left);
  const hasRight = handles.includes(Position.Right);

  if (hasLeft && hasRight) {
    return 2;
  }

  if (hasLeft || hasRight) {
    return 1;
  }

  return 0;
}

const getHeightOffset = (handles: Position[]): number => {
  const hasTop = handles.includes(Position.Top);
  const hasBottom = handles.includes(Position.Bottom);

  if (hasTop && hasBottom) {
    return 2;
  }

  if (hasTop || hasBottom) {
    return 1;
  }

  return 0;
}

export interface ContentOffsets {
  width: string;
  height: string;
  marginLeft: number;
  marginTop: number;
}
