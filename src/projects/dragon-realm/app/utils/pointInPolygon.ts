import type { VectorArray } from '~/types';

const isInsideSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
  return ((py > y1) !== (py > y2)) && (px < (x2 - x1) * (py - y1) / (y2 - y1) + x1);
}

export const pointInPolygon = ([x, y]: [x: number, y: number], vs: VectorArray[], radius: number = 0): boolean => {
  let insideMinusRadius = false;
  let insidePlusRadius = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const [x1, y1] = vs[i];
    const [x2, y2] = vs[j];

    const intersectMinusRadius = isInsideSegment(x, y, x1 - radius, y1 - radius, x2 - radius, y2 - radius);
    const intersectPlusRadius = isInsideSegment(x, y, x1 + radius, y1 + radius, x2 + radius, y2 + radius);

    if (intersectMinusRadius) insideMinusRadius = !insideMinusRadius;
    if (intersectPlusRadius) insidePlusRadius = !insidePlusRadius;
  }

  return insideMinusRadius && insidePlusRadius;
}
