import { Dimensions } from '../types';

/**
 * compute the size of both dimensions while respecting the original ratio
 * @param dimensions
 * @param originalDimensions
 */
export const computeDimensions = (dimensions: Partial<Dimensions>, originalDimensions: Dimensions): Dimensions => {
  const { width, height } = dimensions;
  const { width: originalWidth, height: originalHeight } = originalDimensions;

  const heightRatio = originalHeight / (height ?? originalHeight);
  const widthRatio = originalWidth / (width ?? originalWidth);

  const computedWidth = width ?? Math.round(originalWidth / heightRatio);
  const computedHeight = height ?? Math.round(originalHeight / widthRatio);

  return { width: computedWidth, height: computedHeight };
}
