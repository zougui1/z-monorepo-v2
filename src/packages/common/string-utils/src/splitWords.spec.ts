import { splitWords } from './splitWords';

describe('splitWords', () => {
  it('should split the words', () => {
    const text = '[center]some very useful text[/center]';
    const result = splitWords(text);

    expect(result).toEqual([
      'center',
      'some',
      'very',
      'useful',
      'text',
      'center',
    ]);
  });
});
