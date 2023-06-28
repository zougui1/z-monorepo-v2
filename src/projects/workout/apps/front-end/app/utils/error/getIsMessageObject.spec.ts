import { getIsMessageObject } from './getIsMessageObject';

describe('getIsMessageObject', () => {
  it('should return false when the value is null', () => {
    const value = null;
    const result = getIsMessageObject(value);

    expect(result).toBe(false);
  });

  it('should return false when the value is not an object', () => {
    const value = 'some value';
    const result = getIsMessageObject(value);

    expect(result).toBe(false);
  });

  it('should return false when the value does not have a property message', () => {
    const value = {};
    const result = getIsMessageObject(value);

    expect(result).toBe(false);
  });

  it('should return false when the value has a property message that is not a string', () => {
    const value = { message: { value: 'oh no' } };
    const result = getIsMessageObject(value);

    expect(result).toBe(false);
  });

  it('should return true when the value has a property message that is a string', () => {
    const value = { message: 'oh no' };
    const result = getIsMessageObject(value);

    expect(result).toBe(true);
  });
});
