import parsePdf_ from 'pdf-parse';

import { parsePdf } from './parsePdf';

jest.mock('pdf-parse', () => {
  return jest.fn().mockImplementation(() => {
    return { text: 'Dragons are superior' };
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('parsePdf', () => {
  it('should return the string from the buffer', async () => {
    const string = 'Dragons are superior';
    const buffer = Buffer.from(string);

    const result = await parsePdf(buffer);

    expect(result).toBe(string);
    expect(parsePdf_).toHaveBeenCalledTimes(1);
    expect(parsePdf_).toHaveBeenCalledWith(buffer);
  });
});
