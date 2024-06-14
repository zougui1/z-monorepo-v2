import { getIsInRange } from './getIsInRange';

describe('getIsInRange', () => {
  it('should return true when the value is between the min and max', () => {
    const value = 69;
    const min = 0;
    const max = 100;

    const result = getIsInRange(value, min, max);

    expect(result).toBe(true);
  });

  it('should return false when the value is lower than the min', () => {
    const value = -69;
    const min = 0;
    const max = 100;

    const result = getIsInRange(value, min, max);

    expect(result).toBe(false);
  });

  it('should return false when the value is greater than the max', () => {
    const value = 690;
    const min = 0;
    const max = 100;

    const result = getIsInRange(value, min, max);

    expect(result).toBe(false);
  });
});
