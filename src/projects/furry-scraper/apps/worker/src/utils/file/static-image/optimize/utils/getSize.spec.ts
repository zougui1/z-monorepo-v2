import { Percent } from '@zougui/common.percent-utils';

import { getSize, GetSizeOptions } from './getSize';

describe('getSize', () => {
  it('should throw an error when the max constraint is less than 0', () => {
    const size = 69;
    const options: GetSizeOptions = {
      max: -69,
      min: 42,
    };

    const getResult = () => getSize(size, options);

    expect(getResult).toThrowError(/maximum size constraint must be greater than 0/i);
  });

  describe('when the size is a number', () => {
    it('should throw an error when the size is equal to 0', () => {
      const size = 0;
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
      };

      const getResult = () => getSize(size, options);

      expect(getResult).toThrowError(/size must be greater than 0/i);
    });

    it('should throw an error when the size is less than 0', () => {
      const size = -69;
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
      };

      const getResult = () => getSize(size, options);

      expect(getResult).toThrowError(/size must be greater than 0/i);
    });

    it('should return the minimum when it is greater than the size', () => {
      const size = 19;
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
      };

      const result = getSize(size, options);

      expect(result).toBe(options.min);
    });

    it('should return the maximum when it is less than the size', () => {
      const size = 100;
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
      };

      const result = getSize(size, options);

      expect(result).toBe(options.max);
    });

    it('should return the size when it is between the min and max constraints', () => {
      const size = 56;
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
      };

      const result = getSize(size, options);

      expect(result).toBe(size);
    });
  });

  describe('when the size is a percentage', () => {
    it('should throw an error when the original size is not provided', () => {
      const size: Percent.StringType = '72%';
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
      };

      const getResult = () => getSize(size, options);

      expect(getResult).toThrowError(/cannot have a dynamic size without providing the original size/i);
    });

    it('should return the minimum when it is greater than the percentage of the original size', () => {
      const size: Percent.StringType = '10%';
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
        original: 100,
      };

      const result = getSize(size, options);

      expect(result).toBe(options.min);
    });

    it('should return the maximum when it is less than the percentage of the original size', () => {
      const size: Percent.StringType = '90%';
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
        original: 100,
      };

      const result = getSize(size, options);

      expect(result).toBe(options.max);
    });

    it('should return the percentage of the original size when it is between the min and max constraints', () => {
      const size: Percent.StringType = '25%';
      const options: GetSizeOptions = {
        max: 69,
        min: 42,
        original: 200,
      };

      const result = getSize(size, options);

      expect(result).toBe(50);
    });
  });
});
