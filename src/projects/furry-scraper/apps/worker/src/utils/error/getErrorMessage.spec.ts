import { getErrorMessage } from './getErrorMessage';

describe('getErrorMessage', () => {
  describe('without default message', () => {
    it('should return undefined when the value is null', () => {
      const value = null;
      const result = getErrorMessage(value);

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value is not an object', () => {
      const value = 69;
      const result = getErrorMessage(value);

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value does not have a property message', () => {
      const value = {};
      const result = getErrorMessage(value);

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value has a property message that is not a string', () => {
      const value = { message: { value: 'oh no' } };
      const result = getErrorMessage(value);

      expect(result).toBeUndefined();
    });

    it('should return the value when the value is a string', () => {
      const value = 'oh no';
      const result = getErrorMessage(value);

      expect(result).toBe(value);
    });

    it('should return the message when the value has a property message that is a string', () => {
      const value = { message: 'oh no' };
      const result = getErrorMessage(value);

      expect(result).toBe(value.message);
    });

    it('should return the message when the value is an Error instance', () => {
      const value = new Error('oh no');
      const result = getErrorMessage(value);

      expect(result).toBe(value.message);
    });
  });

  describe('with default message', () => {
    it('should return the default message when the value is null', () => {
      const value = null;
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(defaultMessage);
    });

    it('should return the default message when the value is not an object', () => {
      const value = 69;
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(defaultMessage);
    });

    it('should return the default message when the value does not have a property message', () => {
      const value = {};
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(defaultMessage);
    });

    it('should return the default message when the value has a property message that is not a string', () => {
      const value = { message: { value: 'oh no' } };
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(defaultMessage);
    });

    it('should return the value when the value is a string', () => {
      const value = 'oh no';
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(value);
    });

    it('should return the message when the value has a property message that is a string', () => {
      const value = { message: 'oh no' };
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(value.message);
    });

    it('should return the message when the value is an Error instance', () => {
      const value = new Error('oh no');
      const defaultMessage = 'haha';
      const result = getErrorMessage(value, defaultMessage);

      expect(result).toBe(value.message);
    });
  });
});
