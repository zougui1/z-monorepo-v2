import { dashCase } from './dashCase';

describe('dashCase', () => {
  it('should return the string in dash-case', () => {
    const text = 'some text_followingDifferent-casing';
    const result = dashCase(text);

    expect(result).toBe('some-text-following-different-casing');
  });

  describe('edge cases', () => {
    it('should return the string without an extra dash at the beginning', () => {
      const text = 'Some text_followingDifferent-casing';
      const result = dashCase(text);

      expect(result).toBe('some-text-following-different-casing');
    });

    it('should return the string without a dash at the beginning due to a dash being present in the input', () => {
      const text = '-Some text_followingDifferent-casing';
      const result = dashCase(text);

      expect(result).toBe('-some-text-following-different-casing');
    });
  });
});
