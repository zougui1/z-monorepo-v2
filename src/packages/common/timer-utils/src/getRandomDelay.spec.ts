import { Random } from '@zougui/common.random-utils';

import { getRandomDelay } from './getRandomDelay';

describe('getRandomDelay', () => {
  describe('invalid input', () => {
    it('should throw an error when the min delay is undefined', () => {
      // @ts-expect-error
      expect(() => getRandomDelay(undefined, 69)).toThrowError();
    });

    it('should throw an error when the min delay is NaN', () => {
      expect(() => getRandomDelay(NaN, 69)).toThrowError();
    });

    it('should throw an error when the min delay is Infinity', () => {
      expect(() => getRandomDelay(Infinity, 69)).toThrowError();
    });

    it('should throw an error when the min delay is -Infinity', () => {
      expect(() => getRandomDelay(-Infinity, 69)).toThrowError();
    });

    it('should throw an error when the min delay is a negative number', () => {
      expect(() => getRandomDelay(-69, 69)).toThrowError();
    });

    it('should throw an error when the max delay is undefined', () => {
      // @ts-expect-error
      expect(() => getRandomDelay(69, undefined)).toThrowError();
    });

    it('should throw an error when the max delay is NaN', () => {
      expect(() => getRandomDelay(69, NaN)).toThrowError();
    });

    it('should throw an error when the max delay is Infinity', () => {
      expect(() => getRandomDelay(69, Infinity)).toThrowError();
    });

    it('should throw an error when the max delay is -Infinity', () => {
      expect(() => getRandomDelay(69, -Infinity)).toThrowError();
    });

    it('should throw an error when the max delay is a negative number', () => {
      expect(() => getRandomDelay(69, -69)).toThrowError();
    });
  });

  describe('number input', () => {
    it('should return a random number between the min and max', () => {
      jest.spyOn(Random, 'integer').mockReturnValue(56);

      expect(getRandomDelay(42, 69)).toBe(56);
      expect(Random.integer).toBeCalledWith(42, 69);
    });
  });

  describe('string input', () => {
    it('should return a random number between the min and max converted to milliseconds', () => {
      jest.spyOn(Random, 'integer').mockReturnValue(56000);

      expect(getRandomDelay('42 seconds', '69 seconds')).toBe(56000);
      expect(Random.integer).toBeCalledWith(42000, 69000);
    });
  });
});
