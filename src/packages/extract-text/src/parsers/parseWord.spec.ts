import { parseWord } from './parseWord';

const mockExtract = jest.fn().mockImplementation(async () => {
  return { getBody: () => 'Dragons are superior' };
});

jest.mock('word-extractor', () => {
  return jest.fn().mockImplementation(() => {
    return { extract: mockExtract };
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('parseWord', () => {
  it('should return the string from the buffer', async () => {
    const string = 'Dragons are superior';
    const buffer = Buffer.from(string);

    const result = await parseWord(buffer);

    expect(result).toBe(string);
    expect(mockExtract).toHaveBeenCalledTimes(1);
    expect(mockExtract).toHaveBeenCalledWith(buffer);
  });
});
