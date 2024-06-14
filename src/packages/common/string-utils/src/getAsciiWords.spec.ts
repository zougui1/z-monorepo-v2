import { getAsciiWords } from './getAsciiWords';

describe('getAsciiWords', () => {
  it('should get ASCII words', () => {
    const text = '[center]some very useful text[/center]';
    const result = getAsciiWords(text);

    expect(result).toEqual([
      'center',
      'some',
      'very',
      'useful',
      'text',
      'center',
    ]);
  });

  it('should return an empty array when no words are matched', () => {
    const text = '{}';
    const result = getAsciiWords(text);

    expect(result).toEqual([]);
  });
});
