import type { VectorArray } from '~/types';

export const isClosedPolygon = (points: VectorArray[]): boolean => {
  if (points.length < 2) {
    return false;
  }

  const [[firstX, firstY]] = points;
  const [lastX, lastY] = points[points.length - 1];

  return firstX === lastX && firstY === lastY;
}
