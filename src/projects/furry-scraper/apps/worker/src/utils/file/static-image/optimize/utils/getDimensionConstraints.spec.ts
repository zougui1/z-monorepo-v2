import { getDimensionConstraints, GetDimensionConstraintsOptions } from './getDimensionConstraints';

describe('getDimensionConstraints', () => {
  describe('when min is not a number', () => {
    it('should return min to 0 when it is undefined', () => {
      const options = {
        min: undefined,
        max: 69,
      } satisfies GetDimensionConstraintsOptions;

      const result = getDimensionConstraints(options);

      expect(result).toEqual([0, 69]);
    });

    it('should return min to 0 when it is NaN', () => {
      const options = {
        min: NaN,
        max: 69,
      } satisfies GetDimensionConstraintsOptions;

      const result = getDimensionConstraints(options);

      expect(result).toEqual([0, 69]);
    });
  });

  describe('when max is not a number', () => {
    it('should return max to 0 when it is undefined', () => {
      const options = {
        min: 42,
        max: undefined,
      } satisfies GetDimensionConstraintsOptions;

      const result = getDimensionConstraints(options);

      expect(result).toEqual([42, Number.MAX_SAFE_INTEGER]);
    });

    it('should return max to the max safe integer value when it is NaN', () => {
      const options = {
        min: 42,
        max: NaN,
      } satisfies GetDimensionConstraintsOptions;

      const result = getDimensionConstraints(options);

      expect(result).toEqual([42, Number.MAX_SAFE_INTEGER]);
    });
  });

  describe('when providing an original size', () => {
    it('should return min and max to the original value when it is greater than the min and max', () => {
      const options = {
        min: 42,
        max: 69,
        original: 23,
      } satisfies GetDimensionConstraintsOptions;

      const result = getDimensionConstraints(options);

      expect(result).toEqual([options.original, options.original]);
    });

    it('should return the constraints as is when the original value is greater than the min and max', () => {
      const options = {
        min: 42,
        max: 69,
        original: 123,
      } satisfies GetDimensionConstraintsOptions;

      const result = getDimensionConstraints(options);

      expect(result).toEqual([options.min, options.max]);
    });
  });
});
