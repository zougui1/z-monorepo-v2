import { suffixWith } from './suffixWith';

describe('suffixWith()', () => {
  it('should return the string as is if the suffix is already present', () => {
    const str = 'some text some-suffix';
    const suffix = 'some-suffix';

    const suffixedString = suffixWith(str, suffix);

    expect(suffixedString).toBe(str);
  });

  it('should return the string suffixed if the suffix is not present', () => {
    const str = 'some text';
    const suffix = 'some-suffix';
    const expectedSuffixedString = `${str}${suffix}`

    const suffixedString = suffixWith(str, suffix);

    expect(suffixedString).toBe(expectedSuffixedString);
  });
});
