import { removeBbCode } from './removeBbCode';

describe('removeBbCode', () => {
  it('should remove BB code from the text', () => {
    const text = '[center]some very useful text[/center]';
    const result = removeBbCode(text);

    expect(result).toBe('some very useful text');
  });
});
