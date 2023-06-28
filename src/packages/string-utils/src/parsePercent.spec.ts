import { parsePercent } from './parsePercent';

describe('parsePercent()', () => {
  it('should throw an error when the string is not a valid percentage', () => {
    const percent = '45';
    const getResult = () => parsePercent(percent);

    expect(getResult).toThrowError(/not a valid percent/);
  });

  it('should return a multiplier of the percent when it is valid', () => {
    const percent = '45%';
    const result = parsePercent(percent);

    expect(result).toBe(0.45);
  });
});
