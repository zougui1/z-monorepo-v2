import sharp from 'sharp';

import { getIsInRange } from '@zougui/common.math-utils';

import {
  getOptionalSize,
  getDimensionConstraints,
  calculateDimensions,
  computeDimensions,
} from './utils';
import { Size } from './types';

export const findOptimalSize = async (input: string, options: FindOptimalSizeOptions): Promise<OptimalSize> => {
  const metadata = await sharp(input).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Original size not found.');
  }

  const [minWidth, maxWidth] = getDimensionConstraints({
    min: options.minWidth,
    max: options.maxWidth,
    original: metadata.width,
  });
  const [minHeight, maxHeight] = getDimensionConstraints({
    min: options.minHeight,
    max: options.maxHeight,
    original: metadata.height,
  });

  const height = getOptionalSize(options.height, {
    original: metadata.height,
    min: minHeight,
    max: maxHeight,
  });
  const width = getOptionalSize(options.width, {
    original: metadata.width,
    min: minWidth,
    max: maxWidth,
  });

  if (!height && !width) {
    throw new Error('No optimal size found.');
  }

  const computed = computeDimensions(
    { width, height },
    { width: metadata.width, height: metadata.height },
  );

  if (
    getIsInRange(computed.width, minWidth, maxWidth) &&
    getIsInRange(computed.height, minHeight, maxHeight)
  ) {
    return {
      width,
      height,
    };
  }

  const resolved = calculateDimensions(
    { width: metadata.width, height: metadata.height },
    { width: maxWidth, height: maxHeight },
  )

  return {
    width: resolved.width,
    height: resolved.height,
  };
}

export interface FileSizeConstraints {
  minWidth?: number | undefined;
  maxWidth?: number | undefined;
  minHeight?: number | undefined;
  maxHeight?: number | undefined;
}

export type FindOptimalSizeOptions = FileSizeConstraints & (
  | { width: Size; height?: Size | undefined }
  | { width?: Size | undefined; height: Size }
)

export interface OptimalSize {
  width?: number | undefined;
  height?: number | undefined;
}
