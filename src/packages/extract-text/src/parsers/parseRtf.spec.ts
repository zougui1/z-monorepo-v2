import parser from 'rtf-parser';

import { parseRtf } from './parseRtf';

describe('parseRtf', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when an error is thrown', async () => {
    jest.spyOn(parser, 'string').mockImplementation((raw, callback) => {
      callback(new Error('oh no'), undefined);
    });

    const string = 'Dragons are superior';
    const buffer = Buffer.from(string);

    const getResult = () => parseRtf(buffer);

    await expect(getResult).rejects.toThrowError('oh no');
  });

  it('should throw when there is no result', async () => {
    jest.spyOn(parser, 'string').mockImplementation((raw, callback) => {
      callback(undefined, undefined);
    });

    const string = 'Dragons are superior';
    const buffer = Buffer.from(string);

    const getResult = () => parseRtf(buffer);

    await expect(getResult).rejects.toThrowError(/could not parse/i);
  });

  it('should throw when an error is thrown', async () => {
    jest.spyOn(parser, 'string').mockImplementation((raw, callback) => {
      callback(undefined, {
        content: [
          {
            style: {},
            content: [
              {
                style: {},
                value: 'dragons',
              },
              {
                style: {},
                value: 'are',
              },
            ],
          },
          {
            style: {},
            value: 'superior',
          },
          // test in case a node has no content nor value
          {} as any,
        ],
      });
    });

    const string = 'Dragons are superior';
    const buffer = Buffer.from(string);

    const result = await parseRtf(buffer);

    expect(result).toBe('dragons are superior');
  });
});
