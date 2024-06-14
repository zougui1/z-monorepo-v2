import { getDelay } from './getDelay';

describe('getDelay', () => {
  describe('invalid input', () => {
    it('should throw an error when the delay is undefined', () => {
      // @ts-expect-error
      expect(() => getDelay(undefined)).toThrowError();
    });

    it('should throw an error when the delay is NaN', () => {
      expect(() => getDelay(NaN)).toThrowError();
    });

    it('should throw an error when the delay is Infinity', () => {
      expect(() => getDelay(Infinity)).toThrowError();
    });

    it('should throw an error when the delay is -Infinity', () => {
      expect(() => getDelay(-Infinity)).toThrowError();
    });

    it('should throw an error when the delay is a negative number', () => {
      expect(() => getDelay(-69)).toThrowError();
    });
  });

  describe('number input', () => {
    it('should return the number as is', () => {
      expect(getDelay(42)).toBe(42);
    });
  });

  describe('string input', () => {
    it('should return the value converted to milliseconds', () => {
      expect(getDelay('42 seconds')).toBe(42000);
    });
  });
});
