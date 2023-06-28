import { computeDimensions } from './computeDimensions';
import { Dimensions } from '../types';

describe('computeDimensions', () => {
  describe('when the width is undefined', () => {
    it('should compute the width based on the height', () => {
      const dimensions: Partial<Dimensions> = {
        width: undefined,
        height: 100,
      };

      const originalDimensions: Dimensions = {
        width: 300,
        height: 550,
      };

      const result = computeDimensions(dimensions, originalDimensions);

      expect(result).toEqual({
        width: 55,
        height: 100,
      });
    });
  });

  describe('when the height is undefined', () => {
    it('should compute the height based on the width', () => {
      const dimensions: Partial<Dimensions> = {
        width: 100,
        height: undefined,
      };

      const originalDimensions: Dimensions = {
        width: 300,
        height: 550,
      };

      const result = computeDimensions(dimensions, originalDimensions);

      expect(result).toEqual({
        width: 100,
        height: 183,
      });
    });
  });
});
