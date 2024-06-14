import { parseText } from './parseText';

describe('parseText', () => {
  it('should return the string from the buffer', () => {
    const string = 'Dragons are superior';
    const buffer = Buffer.from(string);

    const result = parseText(buffer);

    expect(result).toBe(string);
  });
});
