import { getAxisBounds } from './getAxisBounds';
import { parseDirection } from './parseDirection';
import { Position, type Direction } from '../enums';

export const getBounds = (element: HTMLElement, options: GetBoundsOptions): GetBoundsResult => {
  const {
    startWidth,
    minWidth,
    maxWidth,
    startHeight,
    minHeight,
    maxHeight,
    startX,
    startY,
    clientX,
    clientY,
    maxLeft,
    maxTop,
    direction,
    enabledHandles,
  } = options;

  const directions = parseDirection(direction).filter(direction => enabledHandles.includes(direction));
  const resizeLeft = directions.includes(Position.Left);
  const resizeRight = directions.includes(Position.Right);
  const resizeTop = directions.includes(Position.Top);
  const resizeBottom = directions.includes(Position.Bottom);

  const result: GetBoundsResult = {
    height: undefined,
    width: undefined,
    top: undefined,
    left: undefined,
  };

  if (resizeLeft || resizeRight) {
    const { size, position } = getAxisBounds({
      oppositeDirection: resizeLeft,
      size: element.clientWidth,
      startSize: startWidth,
      minSize: minWidth,
      maxSize: maxWidth,
      cursorPosition: clientX,
      currentPosition: element.clientLeft,
      startPosition: startX,
      maxPosition: maxLeft,
      windowSize: window.innerWidth,
    });

    result.left = position;
    result.width = size;
  }

  if (resizeTop || resizeBottom) {
    const { size, position } = getAxisBounds({
      oppositeDirection: resizeTop,
      size: element.clientHeight,
      startSize: startHeight,
      minSize: minHeight,
      maxSize: maxHeight,
      cursorPosition: clientY,
      currentPosition: element.clientTop,
      startPosition: startY,
      maxPosition: maxTop,
      windowSize: window.innerHeight,
    });

    result.top = position;
    result.height = size;
  }

  return result;
}

export interface GetBoundsOptions {
  startWidth: number;
  minWidth: number;
  maxWidth: number;
  startHeight: number;
  minHeight: number;
  maxHeight: number;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  maxLeft: number;
  maxTop: number;
  direction: Direction;
  enabledHandles: Position[];
}

export interface GetBoundsResult {
  left: number | undefined;
  width: number | undefined;
  top: number | undefined;
  height: number | undefined;
}
