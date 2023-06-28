import { Dimensions } from '../types';

export const calculateDimensions = (originalDimensions: Dimensions, max: Dimensions): Dimensions => {
  const { width: originalWidth, height: originalHeight } = originalDimensions;

  const widthRatio = originalWidth / max.width;
  const heightRatio = originalHeight / max.height;

  const newWidth = Math.min(
    Math.round(originalWidth / widthRatio),
    Math.round(originalWidth / heightRatio),
  );
  const newHeight = Math.min(
    Math.round(originalHeight / heightRatio),
    Math.round(originalHeight / widthRatio),
  );

  return { width: newWidth, height: newHeight };
}
