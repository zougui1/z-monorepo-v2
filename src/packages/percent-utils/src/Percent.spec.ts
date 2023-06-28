import { Percent } from './Percent';

describe('Percent', () => {
  describe('fromString', () => {
    it('should return the number from the string', () => {
      const string: Percent.StringType = '69%';
      const result = Percent.fromString(string);

      expect(result).toBe(69);
    });

    it('should throw an error when no number could be parsed from the string', () => {
      // @ts-expect-error
      const string: Percent.StringType = 'dragon';
      const getResult = () => Percent.fromString(string);

      expect(getResult).toThrowError();
    });
  });

  describe('toString', () => {
    it('should return the a percentage string from the number', () => {
      const number = 69;
      const result = Percent.toString(number);

      expect(result).toBe('69%');
    });
  });

  describe('fromMultiplier', () => {
    it('should return a number in percent from a multiplier', () => {
      const number = 0.69;
      const result = Percent.fromMultiplier(number);

      expect(result).toBe(69);
    });
  });

  describe('toMultiplier', () => {
    it('should return a multiplier from a percentage number', () => {
      const number = 69;
      const result = Percent.toMultiplier(number);

      expect(result).toBe(0.69);
    });
  });

  describe('apply', () => {
    it('should apply a percentage to the number', () => {
      const percent: Percent.StringType = '69%';
      const number = 100;
      const result = Percent.apply(percent, number);

      expect(result).toBe(69);
    });

    it('should throw an error when no number could be parsed from the percentage string', () => {
      const percent: Percent.StringType = 'dragon' as any;
      const number = 100;
      const getResult = () => Percent.apply(percent, number);

      expect(getResult).toThrowError();
    });
  });

  describe('apply', () => {
    it('should apply a percentage to the number', () => {
      const percent: Percent.StringType = '69%';
      const number = 100;
      const result = Percent.tryApply(percent, number);

      expect(result).toBe(69);
    });

    it('should return undefined when no number could be parsed from the percentage string', () => {
      const percent: Percent.StringType = 'dragon' as any;
      const number = 100;
      const result = Percent.tryApply(percent, number);

      expect(result).toBeUndefined();
    });
  });

  describe('isValidString', () => {
    it('should return true when the string is a valid percentage', () => {
      const percent = '69%';
      const result = Percent.isValidString(percent);

      expect(result).toBe(true);
    });

    it('should return false when the string is not a valid percentage', () => {
      const percent = 'dragon';
      const result = Percent.isValidString(percent);

      expect(result).toBe(false);
    });
  });
});
