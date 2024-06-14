import { parsePathComponent } from './parsePathComponent';

describe('parsePathComponent', () => {
  describe('static path component', () => {
    it('should parse it when required', () => {
      const pathComponent = 'users';
      const result = parsePathComponent(pathComponent);

      expect(result).toEqual({
        name: 'users',
        isDynamic: false,
        isOptional: false,
      });
    });

    it('should parse it when optional', () => {
      const pathComponent = 'users?';
      const result = parsePathComponent(pathComponent);

      expect(result).toEqual({
        name: 'users',
        isDynamic: false,
        isOptional: true,
      });
    });
  });

  describe('dynamic path component', () => {
    it('should parse it when required', () => {
      const pathComponent = ':users';
      const result = parsePathComponent(pathComponent);

      expect(result).toEqual({
        name: 'users',
        isDynamic: true,
        isOptional: false,
      });
    });

    it('should parse it when optional', () => {
      const pathComponent = ':users?';
      const result = parsePathComponent(pathComponent);

      expect(result).toEqual({
        name: 'users',
        isDynamic: true,
        isOptional: true,
      });
    });
  });
});
