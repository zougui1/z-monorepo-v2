import apng from 'sharp-apng';

import { getAnimatedImageMetadata } from './getAnimatedImageMetadata';

const mocks = {
  sharp: jest.fn(),
};

jest.mock('sharp', () => {
  return (...args: any[]) => mocks.sharp(...args);
});

afterEach(() => {
  mocks.sharp.mockReset();
  jest.clearAllMocks();
});

describe('getAnimatedImageMetadata', () => {
  describe('when the file is an animated PNG', () => {
    it('should throw an error when the wrong type is returned when parsing an APNG', async () => {
      const filePath = 'path/to/image.png';
      const extension = '.png';

      jest.spyOn(apng, 'framesFromApng').mockReturnValue([]);

      const getResult = () => getAnimatedImageMetadata(filePath, extension);

      expect(getResult).rejects.toThrowError();
    });

    it('should return the metadata for the extension .png', async () => {
      const filePath = 'path/to/image.png';
      const extension = '.png';

      jest.spyOn(apng, 'framesFromApng').mockReturnValue({
        frames: [
          {
            metadata: async () => ({
              width: undefined,
              height: undefined,
            }),
          },
          {
            metadata: async () => ({
              width: 1456,
              height: 875,
            }),
          },
          {
            metadata: async () => ({
              width: 2457,
              height: 754,
            }),
          },
        ],
        delay: [200, 200, 200],
      } as any);

      const result = await getAnimatedImageMetadata(filePath, extension);

      expect(result).toEqual({
        width: 2457,
        height: 875,
        duration: 0.6,
        frameCount: 3,
        frameRate: 5
      });
    });

    it('should return the metadata for the extension .apng', async () => {
      const filePath = 'path/to/image.apng';
      const extension = '.apng';

      jest.spyOn(apng, 'framesFromApng').mockReturnValue({
        frames: [
          {
            metadata: async () => ({
              width: undefined,
              height: undefined,
            }),
          },
          {
            metadata: async () => ({
              width: 1456,
              height: 875,
            }),
          },
          {
            metadata: async () => ({
              width: 2457,
              height: 754,
            }),
          },
        ],
        delay: [200, 200, 200],
      } as any);

      const result = await getAnimatedImageMetadata(filePath, extension);

      expect(result).toEqual({
        width: 2457,
        height: 875,
        duration: 0.6,
        frameCount: 3,
        frameRate: 5
      });
    });

    it('should return the metadata even if there is no frame', async () => {
      const filePath = 'path/to/image.apng';
      const extension = '.apng';

      jest.spyOn(apng, 'framesFromApng').mockReturnValue({
        delay: [],
      } as any);

      const result = await getAnimatedImageMetadata(filePath, extension);

      expect(result).toEqual({
        width: 0,
        height: 0,
        duration: 0,
        frameCount: 0,
        frameRate: 0
      });
    });
  });

  describe('when the file is not an animated PNG', () => {
    it('should throw an error when no width is found', async () => {
      const filePath = 'path/to/image.webp';
      const extension = '.webp';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          height: 875,
        }),
      });

      const getResult = () => getAnimatedImageMetadata(filePath, extension);

      expect(getResult).rejects.toThrowError();
    });

    it('should throw an error when no height is found', async () => {
      const filePath = 'path/to/image.webp';
      const extension = '.webp';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          width: 875,
        }),
      });

      const getResult = () => getAnimatedImageMetadata(filePath, extension);

      expect(getResult).rejects.toThrowError();
    });

    it('should return the metadata for the extension .webp', async () => {
      const filePath = 'path/to/image.webp';
      const extension = '.webp';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          width: 1456,
          height: 875,
          pages: 3,
          delay: [200, 200, 200],
        }),
      });

      const result = await getAnimatedImageMetadata(filePath, extension);

      expect(result).toEqual({
        width: 1456,
        height: 875,
        duration: 0.6,
        frameCount: 3,
        frameRate: 5
      });
    });

    it('should return the metadata even when there is no frame', async () => {
      const filePath = 'path/to/image.webp';
      const extension = '.webp';

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          width: 1456,
          height: 875,
        }),
      });

      const result = await getAnimatedImageMetadata(filePath, extension);

      expect(result).toEqual({
        width: 1456,
        height: 875,
        duration: 0,
        frameCount: 0,
        frameRate: 0
      });
    });
  });
});
