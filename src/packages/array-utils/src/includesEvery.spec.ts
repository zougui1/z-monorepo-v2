import { includesEvery } from './includesEvery';

describe('includesEvery', () => {
  it('should return false when the array is empty', () => {
    const array: string[] = [];
    const searchElements: string[] = ['tt'];

    const result = includesEvery(array, searchElements);

    expect(result).toBe(false);
  });

  it('should return false when there are no search elements', () => {
    const array: string[] = ['tt'];
    const searchElements: string[] = [];

    const result = includesEvery(array, searchElements);

    expect(result).toBe(false);
  });

  it('should return false when the array does not include every search element', () => {
    const array: string[] = ['dragon', 'sexy'];
    const searchElements: string[] = ['ugly', 'dragon'];

    const result = includesEvery(array, searchElements);

    expect(result).toBe(false);
  });

  it('should return true when the array includes every search element', () => {
    const array: string[] = ['dragon', 'sexy'];
    const searchElements: string[] = ['sexy', 'dragon'];

    const result = includesEvery(array, searchElements);

    expect(result).toBe(true);
  });
});
