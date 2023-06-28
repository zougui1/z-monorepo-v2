import { sum } from '@zougui/common.math-utils';

export const computeAnimatedImageMetadata = (options: ComputeAnimatedImageMetadataOptions): ComputedAnimatedImageMetadata => {
  if (!options.delay || !options.pages) {
    return {};
  }

  const duration = sum(options.delay) / 1000;
  const frameCount = options.pages;
  // or 1 to prevent potential errors from trying to divide by 0
  const frameRate = frameCount / (duration || 1);

  return {
    duration,
    frameCount,
    frameRate,
  };
}

export interface ComputeAnimatedImageMetadataOptions {
  delay?: number[] | undefined;
  pages?: number | undefined;
}

export interface ComputedAnimatedImageMetadata {
  duration?: number | undefined;
  frameCount?: number | undefined;
  frameRate?: number | undefined;
}
