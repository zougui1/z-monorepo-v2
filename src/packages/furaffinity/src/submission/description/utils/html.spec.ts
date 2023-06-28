import stringStripHtml from 'string-strip-html';
import jsdom from 'jsdom';

import { parseSafeHTML } from './html';

describe('parseSafeHTML', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse HTML without script, style and xml tags', () => {
    jest
      .spyOn(stringStripHtml, 'stripHtml')
      .mockReturnValue({ result: 'safe HTML string' } as any);
    jest
      .spyOn(jsdom, 'JSDOM')
      .mockReturnValue({ window: { document: { name: 'DOCUMENT' } } } as any);

    const result = parseSafeHTML('unsafe HTML string');

    expect(stringStripHtml.stripHtml).toBeCalledTimes(1);
    expect(stringStripHtml.stripHtml).toBeCalledWith('unsafe HTML string', {
      onlyStripTags: ['script', 'style', 'xml'],
      stripTogetherWithTheirContents: ['script', 'style', 'xml'],
    });
    expect(jsdom.JSDOM).toBeCalledTimes(1);
    expect(jsdom.JSDOM).toBeCalledWith('<!DOCTYPE html>safe HTML string');
    expect(result).toEqual({
      window: { document: { name: 'DOCUMENT' } },
      document: { name: 'DOCUMENT' },
    });
  });
});
