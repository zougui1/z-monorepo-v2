import { sum } from './sum';

describe('sum', () => {
  it('should return 0 when there are no numbers', () => {
    const numbers: number[] = [];
    const result = sum(numbers);

    expect(result).toBe(0);
  });

  it('should return the sum of all the numbers', () => {
    const numbers = [42, 69];
    const result = sum(numbers);

    expect(result).toBe(111);
  });
});
