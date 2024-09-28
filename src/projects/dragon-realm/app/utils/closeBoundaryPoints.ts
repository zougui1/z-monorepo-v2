import type { VectorArray } from '~/types';

export const closeBoundaryPoints = (boundaryPoints: VectorArray[]): VectorArray[] => {
  if (boundaryPoints.length === 0) {
    return boundaryPoints;
  }

  const closedBoundaryPoints: VectorArray[] = [...boundaryPoints];
  const [firstX, firstY] = boundaryPoints[0];
  const [lastX, lastY, lastZ] = boundaryPoints[boundaryPoints.length - 1];

  // Add intermediate points to close the boundary without diagonals
  if (lastX !== firstX || lastY !== firstY) {
    // If the last point's x-coordinate is not equal to the first point's x-coordinate
    if (lastX !== firstX) {
      closedBoundaryPoints.push([firstX, lastY, lastZ]);
    }

    // Finally, ensure that the last point's y-coordinate matches the first point's y-coordinate
    if (lastY !== firstY) {
      closedBoundaryPoints.push([firstX, firstY, lastZ]);
    }
  }

  return closedBoundaryPoints;
}
