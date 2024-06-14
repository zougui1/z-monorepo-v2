import {
  computeAnimatedImageMetadata,
  ComputeAnimatedImageMetadataOptions,
} from './computeAnimatedImageMetadata';

describe('computeAnimatedImageMetadata', () => {
  describe('when missing data', () => {
    it('should return undefined when there is no delay', () => {
      const options: ComputeAnimatedImageMetadataOptions = {
        delay: undefined,
        pages: 3,
      };

      const result = computeAnimatedImageMetadata(options);

      expect(result).toEqual({});
    });

    it('should return undefined when there is no page', () => {
      const options: ComputeAnimatedImageMetadataOptions = {
        delay: [100, 200, 500],
        pages: undefined,
      };

      const result = computeAnimatedImageMetadata(options);

      expect(result).toEqual({});
    });
  });

  describe('with all required data', () => {
    it('should return animation data', () => {
      const options: ComputeAnimatedImageMetadataOptions = {
        delay: [100, 200, 500],
        pages: 3,
      };

      const result = computeAnimatedImageMetadata(options);

      expect(result).toEqual({
        duration: 0.8,
        frameCount: 3,
        frameRate: 3.75,
      });
    });

    it('should return animation data even when the delay sums to 0', () => {
      const options: ComputeAnimatedImageMetadataOptions = {
        delay: [0, 0, 0],
        pages: 3,
      };

      const result = computeAnimatedImageMetadata(options);

      expect(result).toEqual({
        duration: 0,
        frameCount: 3,
        frameRate: 3,
      });
    });
  });
});
