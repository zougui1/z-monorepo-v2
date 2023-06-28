import { getTextMetadata } from './getTextMetadata';

const mocks = {
  countWords: jest.fn(),
  stat: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    stat: (...args: any[]) => mocks.stat(...args),
  };
});

jest.mock('./countWords', () => {
  return {
    countWords: (...args: any[]) => mocks.countWords(...args),
  };
});

describe('getTextMetadata', () => {
  afterEach(() => {
    mocks.stat.mockReset();
    mocks.countWords.mockReset();
    jest.clearAllMocks();
  });

  it('should return the size of the file as well as its word count', async () => {
    const file = 'dragons/sexy-stuff.docx';

    mocks.countWords.mockResolvedValue(69);
    mocks.stat.mockResolvedValue({
      size: 69420,
    });

    const result = await getTextMetadata(file);

    expect(result).toEqual({
      wordCount: 69,
      size: 69420,
    });
  });
});
