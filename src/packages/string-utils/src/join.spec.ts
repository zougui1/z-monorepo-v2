import { join } from './join';

describe('join()', () => {
  it('should return the strings joined together', () => {
    const strings = ['a', 'b', 'c', '&d', 'e&', '&f&', '&g'];
    const separator = '&';
    const expectedString = 'a&b&c&d&e&f&g';

    const result = join(strings, separator);

    expect(result).toBe(expectedString);
  });

  it('should return the strings joined together preserving the end separator when present at the end of the last string', () => {
    const strings = ['a', 'b', 'c', '&d', 'e&', '&f&', '&g&'];
    const separator = '&';
    const expectedString = 'a&b&c&d&e&f&g&';

    const result = join(strings, separator);

    expect(result).toBe(expectedString);
  });

  it('should return the strings joined together with preserving the start separator when present at the start of the first string', () => {
    const strings = ['&a', 'b', 'c', '&d', 'e&', '&f&', '&g'];
    const separator = '&';
    const expectedString = '&a&b&c&d&e&f&g';

    const result = join(strings, separator);

    expect(result).toBe(expectedString);
  });

  it('should return an empty string when there is no string in the input', () => {
    const strings: string[] = [];
    const separator = '&';
    const expectedString = '';

    const result = join(strings, separator);

    expect(result).toBe(expectedString);
  });
});
