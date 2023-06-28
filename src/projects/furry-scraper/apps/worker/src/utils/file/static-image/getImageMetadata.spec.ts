import { getImageMetadata } from './getImageMetadata';

const mocks = {
  sharp: jest.fn(),
  stat: jest.fn(),
};

jest.mock('sharp', () => {
  return (...args: any[]) => mocks.sharp(...args);
});

jest.mock('fs-extra', () => {
  return {
    stat: (...args: any[]) => mocks.stat(...args),
  };
});

describe('getImageMetadata', () => {
  afterEach(() => {
    mocks.sharp.mockReset();
    mocks.stat.mockReset();
    jest.clearAllMocks();
  });

  describe('when the width of the image could not be found', () => {
    it('should throw an error', async () => {
      const file = 'dragons/sexy-stuff.png';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({ height: 69 }),
      });
      mocks.stat.mockResolvedValue({ size: 69420 });

      const getResult = () => getImageMetadata(file);

      expect(getResult).rejects.toThrowError(/size not found/i);
      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(file);
      expect(mocks.stat).toBeCalledTimes(1);
      expect(mocks.stat).toBeCalledWith(file);
    });
  });

  describe('when the height of the image could not be found', () => {
    it('should throw an error', async () => {
      const file = 'dragons/sexy-stuff.png';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({ width: 69 }),
      });
      mocks.stat.mockResolvedValue({ size: 69420 });

      const getResult = () => getImageMetadata(file);

      expect(getResult).rejects.toThrowError(/size not found/i);
      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(file);
      expect(mocks.stat).toBeCalledTimes(1);
      expect(mocks.stat).toBeCalledWith(file);
    });
  });

  describe('when both the width and height of the image could be found', () => {
    it('should return the metadata of the image', async () => {
      const file = 'dragons/sexy-stuff.png';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({ width: 69, height: 42 }),
      });
      mocks.stat.mockResolvedValue({ size: 69420 });

      const result = await getImageMetadata(file);

      expect(result).toEqual({
        size: 69420,
        width: 69,
        height: 42,
      });
      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(file);
      expect(mocks.stat).toBeCalledTimes(1);
      expect(mocks.stat).toBeCalledWith(file);
    });
  });
});
