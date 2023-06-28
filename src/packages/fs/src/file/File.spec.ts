import { File } from './File';

const mocks = {
  readBytes: jest.fn(),
};

jest.mock('../utils', () => {
  return {
    readBytes: (...args: any[]) => mocks.readBytes(...args),
  };
});

describe('File', () => {
  afterEach(() => {
    mocks.readBytes.mockReset();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should construct a file', () => {
      const filePath = '/path/to/dragon-file.png';

      const result = new File(filePath);

      expect(result).toEqual({
        extension: '.png',
        dir: '/path/to',
        path: filePath,
        fileName: 'dragon-file.png',
        withoutExtension: {
          path: '/path/to/dragon-file',
          fileName: 'dragon-file',
        },
        metadata: {
          path: filePath,
          get: expect.any(Function),
        },
      });
    });
  });

  describe('readBytes', () => {
    it('should read the bytes of the file', async () => {
      const filePath = '/path/to/dragon-file.png';

      mocks.readBytes.mockResolvedValue(Buffer.from('dfguih'));

      const file = new File(filePath);
      const result = await file.readBytes();

      expect(result).toEqual(Buffer.from('dfguih'));
    });
  });
});
