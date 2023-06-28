import { indent, IndentOptions } from './indent';

describe('indent', () => {
  describe('with default options', () => {
    it('should return the same text with 2 whitespaces at the beginning of every line', () => {
      const text = 'line 1\nline 2\nline 3';
      const result = indent(text);

      expect(result).toBe('  line 1\n  line 2\n  line 3');
    });
  });

  describe('with level option', () => {
    it('should return the same text with 4 whitespaces at the beginning of every line', () => {
      const text = 'line 1\nline 2\nline 3';
      const options: IndentOptions = {
        level: 4,
      };

      const result = indent(text, options);

      expect(result).toBe('    line 1\n    line 2\n    line 3');
    });
  });

  describe('with character option', () => {
    it('should return the same text with 2 dashes at the beginning of every line', () => {
      const text = 'line 1\nline 2\nline 3';
      const options: IndentOptions = {
        character: '-',
      };

      const result = indent(text, options);

      expect(result).toBe('--line 1\n--line 2\n--line 3');
    });
  });
});
