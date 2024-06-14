import { removeSuffix } from './removeSuffix';

describe('removeSuffix()', () => {
  it('should return the string as is if the suffix is not present', () => {
    const str = 'some text';
    const suffix = 'some-suffix';

    const result = removeSuffix(str, suffix);

    expect(result).toBe(str);
  });

  it('should return the string without the suffix if the suffix is present', () => {
    const expectedString = 'some text';
    const suffix = 'some-suffix';
    const str = `${expectedString}${suffix}`;

    const result = removeSuffix(str, suffix);

    expect(result).toBe(expectedString);
  });
});
