import { clamp } from './clamp';

describe('clamp', () => {
  it('should return the value as is when it is between the min and max', () => {
    const value = 69;
    const min = 0;
    const max = 100;

    const result = clamp(value, min, max);

    expect(result).toBe(value);
  });

  it('should return the min when the value is lower than the min', () => {
    const value = -69;
    const min = 0;
    const max = 100;

    const result = clamp(value, min, max);

    expect(result).toBe(min);
  });

  it('should return the max when the value is greater than the max', () => {
    const value = 690;
    const min = 0;
    const max = 100;

    const result = clamp(value, min, max);

    expect(result).toBe(max);
  });
});
