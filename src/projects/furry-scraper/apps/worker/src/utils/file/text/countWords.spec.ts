import { countWords } from './countWords';

const mocks = {
  readText: jest.fn(),
};

jest.mock('@zougui/common.extract-text', () => {
  return {
    readText: (...args: any[]) => mocks.readText(...args),
  };
});

describe('countWords', () => {
  afterEach(() => {
    mocks.readText.mockReset();
    jest.clearAllMocks();
  });

  it('should count the words resolved by readText', async () => {
    const file = 'dragons/sexy-stuff.docx';

    mocks.readText.mockResolvedValue('dragons are sexy');
    const result = await countWords(file);

    expect(result).toBe(3);
  });
});
