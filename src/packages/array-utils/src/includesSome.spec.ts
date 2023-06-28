import { includesSome } from './includesSome';

describe('includesSome', () => {
  it('should return false when the array is empty', () => {
    const array: string[] = [];
    const searchElements: string[] = ['tt'];

    const result = includesSome(array, searchElements);

    expect(result).toBe(false);
  });

  it('should return false when there are no search elements', () => {
    const array: string[] = ['tt'];
    const searchElements: string[] = [];

    const result = includesSome(array, searchElements);

    expect(result).toBe(false);
  });

  it('should return false when the array does not include any of the search elements', () => {
    const array: string[] = ['dragon', 'sexy'];
    const searchElements: string[] = ['ugly'];

    const result = includesSome(array, searchElements);

    expect(result).toBe(false);
  });

  it('should return true when the array includes at least one of the search elements', () => {
    const array: string[] = ['dragon', 'sexy'];
    const searchElements: string[] = ['sexy'];

    const result = includesSome(array, searchElements);

    expect(result).toBe(true);
  });
});
