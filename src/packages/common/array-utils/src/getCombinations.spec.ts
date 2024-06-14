import { getCombinations, GetCombinationsOptions } from './getCombinations';

describe('getCombinations', () => {
  describe('without options', () => {
    it('should return an empty array when receiving an empty array', () => {
      const array: any[] = [];
      const options = undefined;

      const result = getCombinations(array, options);

      expect(result).toEqual([]);
    });

    it('should return combinations with a min length of 1 and a max length of the array\'s length', () => {
      const array = ['dragon 1', 'dragon 2', 'dragon 3'];
      const options = undefined;

      const result = getCombinations(array, options);

      expect(result).toEqual([
        ['dragon 1'],
        ['dragon 2'],
        ['dragon 3'],
        ['dragon 1', 'dragon 2'],
        ['dragon 1', 'dragon 3'],
        ['dragon 2', 'dragon 3'],
        ['dragon 1', 'dragon 2', 'dragon 3'],
      ]);
    });
  });

  describe('with the option length', () => {
    it('should return an empty array when receiving an empty array', () => {
      const array: any[] = [];
      const options: GetCombinationsOptions = {
        length: 2,
      };

      const result = getCombinations(array, options);

      expect(result).toEqual([]);
    });

    it('should return combinations with a length of the given option', () => {
      const array = ['dragon 1', 'dragon 2', 'dragon 3'];
      const options: GetCombinationsOptions = {
        length: 2,
      };

      const result = getCombinations(array, options);

      expect(result).toEqual([
        ['dragon 1', 'dragon 2'],
        ['dragon 1', 'dragon 3'],
        ['dragon 2', 'dragon 3'],
      ]);
    });
  });

  describe('with the options min length and max length', () => {
    it('should return an empty array when receiving an empty array', () => {
      const array: any[] = [];
      const options: GetCombinationsOptions = {
        length: 2,
      };

      const result = getCombinations(array, options);

      expect(result).toEqual([]);
    });

    it('should return combinations with a min and max length of the given options', () => {
      const array = ['dragon 1', 'dragon 2', 'dragon 3'];
      const options: GetCombinationsOptions = {
        minLength: 2,
        maxLength: 3,
      };

      const result = getCombinations(array, options);

      expect(result).toEqual([
        ['dragon 1', 'dragon 2'],
        ['dragon 1', 'dragon 3'],
        ['dragon 2', 'dragon 3'],
        ['dragon 1', 'dragon 2', 'dragon 3'],
      ]);
    });
  });
});
