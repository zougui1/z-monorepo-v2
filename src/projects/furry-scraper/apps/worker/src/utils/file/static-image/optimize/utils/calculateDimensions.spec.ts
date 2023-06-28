import { calculateDimensions } from './calculateDimensions';
import { Dimensions } from '../types';

describe('calculateDimensions', () => {
  describe('when both the width and height are smaller than the max constraints', () => {
    it('should return the max constrauints', () => {
      const originalDimensions: Dimensions = {
        width: 300,
        height: 600,
      };

      const max: Dimensions = {
        width: 200,
        height: 400,
      };

      const result = calculateDimensions(originalDimensions, max);

      expect(result).toEqual(max)
    });
  });

  describe('when only the width is smaller than its constraint', () => {
    it('should calculate the width based on the height', () => {
      const originalDimensions: Dimensions = {
        width: 300,
        height: 600,
      };

      const max: Dimensions = {
        width: 150,
        height: 800,
      };

      const result = calculateDimensions(originalDimensions, max);

      expect(result).toEqual({
        width: max.width,
        height: 300,
      });
    });
  });

  describe('when only the height is smaller than its constraint', () => {
    it('should calculate the height based on the width', () => {
      const originalDimensions: Dimensions = {
        width: 300,
        height: 600,
      };

      const max: Dimensions = {
        width: 500,
        height: 540,
      };

      const result = calculateDimensions(originalDimensions, max);

      expect(result).toEqual({
        width: 270,
        height: max.height,
      })
    });
  });
});
