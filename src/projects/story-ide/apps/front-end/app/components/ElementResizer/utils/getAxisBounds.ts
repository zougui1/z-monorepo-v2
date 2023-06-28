import { Bound } from '~/utils';

const minPosition = 0;

export const getAxisBounds = (options: GetAxisBoundsOptions): GetAxisBoundsResult => {
  const {
    size,
    startSize,
    minSize,
    maxSize,
    cursorPosition,
    currentPosition,
    startPosition,
    windowSize,
    oppositeDirection,
  } = options;

  const maxPosition = oppositeDirection ? options.maxPosition : (windowSize - 5)
  const positionBound = new Bound(minPosition, maxPosition);
  const sizeBound = new Bound(minSize, maxSize);

  const newPosition = positionBound.clamp(cursorPosition);
  const sizeDelta = oppositeDirection
    ? (startPosition - newPosition)
    : (newPosition - startPosition);
  const computedSize = startSize + sizeDelta;
  const newSize = sizeBound.clamp(computedSize);

  // this condition is necessary because of a bug where an offset is created when
  // trying to resize the element outside of its min/max bounds
  if (!sizeBound.getIsInRange(computedSize) || !positionBound.getIsInRange(cursorPosition)) {
    // ensures that the element is at min/max width if it isn't already
    if (sizeBound.clamp(size) !== newSize && (!currentPosition || positionBound.clamp(currentPosition) !== newPosition)) {
      return {
        size: newSize,
        position: oppositeDirection ? newPosition : undefined,
      };
    }
  } else {
    return {
      size: newSize,
      position: oppositeDirection ? newPosition : undefined,
    };
  }

  return {
    size,
    position: undefined,
  };
}

export interface GetAxisBoundsOptions {
  size: number;
  startSize: number;
  minSize: number;
  maxSize: number;
  currentPosition: number | undefined;
  startPosition: number;
  cursorPosition: number;
  maxPosition: number;
  windowSize: number;
  oppositeDirection: boolean;
}

export interface GetAxisBoundsResult {
  size: number;
  position: number | undefined;
}
