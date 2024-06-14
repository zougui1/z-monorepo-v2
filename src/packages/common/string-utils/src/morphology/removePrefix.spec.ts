import { removePrefix } from './removePrefix';

describe('removePrefix()', () => {
  it('should return the string as is if the prefix is not present', () => {
    const str = 'some text';
    const prefix = 'some-prefix';

    const result = removePrefix(str, prefix);

    expect(result).toBe(str);
  });

  it('should return the string without the prefix if the prefix is present', () => {
    const expectedString = 'some text';
    const prefix = 'some-prefix';
    const str = `${prefix}${expectedString}`;

    const result = removePrefix(str, prefix);

    expect(result).toBe(expectedString);
  });
});
