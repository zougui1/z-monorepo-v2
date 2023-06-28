import { getFileMetadata } from './getFileMetadata';

const mocks = {
  getImageMetadata: jest.fn(),
  getAnimationMetadata: jest.fn(),
  getAudioMetadata: jest.fn(),
  getTextMetadata: jest.fn(),
  getFlashMetadata: jest.fn(),
};

jest.mock('./static-image', () => {
  return {
    getImageMetadata: (...args: any[]) => mocks.getImageMetadata(...args),
  };
});

jest.mock('./animation', () => {
  return {
    getAnimationMetadata: (...args: any[]) => mocks.getAnimationMetadata(...args),
  };
});

jest.mock('./audio', () => {
  return {
    getAudioMetadata: (...args: any[]) => mocks.getAudioMetadata(...args),
  };
});

jest.mock('./text', () => {
  return {
    getTextMetadata: (...args: any[]) => mocks.getTextMetadata(...args),
  };
});

jest.mock('./flash', () => {
  return {
    getFlashMetadata: (...args: any[]) => mocks.getFlashMetadata(...args),
  };
});

describe('getFileMetadata', () => {
  afterEach(() => {
    mocks.getImageMetadata.mockReset();
    mocks.getAnimationMetadata.mockReset();
    mocks.getAudioMetadata.mockReset();
    mocks.getTextMetadata.mockReset();
    mocks.getFlashMetadata.mockReset();
    jest.clearAllMocks();
  });

  it('should it should throw an error when there is no extension in the file path', () => {
    const file = 'toto';
    const getResult = () => getFileMetadata(file);

    expect(getResult).rejects.toThrowError(/no extension found/i);
  });

  it('should it should throw an error when there extension is not supported', () => {
    const file = 'toto.ts';
    const getResult = () => getFileMetadata(file);

    expect(getResult).rejects.toThrowError(/no content-type found/i);
  });

  describe('when the file is a static image', () => {
    const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.bmp'];

    test.each(extensions)('should return static image metadata for extension %p', async extension => {
      const file = 'toto' + extension;

      mocks.getImageMetadata.mockResolvedValue({
        size: 69420,
        width: 1547,
        height: 874,
      });

      const result = await getFileMetadata(file);

      expect(result).toEqual({
        size: 69420,
        width: 1547,
        height: 874,
      });
    });
  });

  describe('when the file is a text or doc file', () => {
    const extensions = ['.txt', '.doc', '.docx', '.pdf', '.rtf', '.odt', '.odp', '.ods'];

    test.each(extensions)('should return text metadata for extension %p', async extension => {
      const file = 'toto' + extension;

      mocks.getTextMetadata.mockResolvedValue({
        size: 69420,
        wordCount: 145,
      });

      const result = await getFileMetadata(file);

      expect(result).toEqual({
        size: 69420,
        wordCount: 145,
      });
    });
  });

  describe('when the file is an audio', () => {
    const extensions = ['.mp3', '.wav', '.ogg'];

    test.each(extensions)('should return audio metadata for extension %p', async extension => {
      const file = 'toto' + extension;

      mocks.getAudioMetadata.mockResolvedValue({
        size: 69420,
        duration: 145,
      });

      const result = await getFileMetadata(file);

      expect(result).toEqual({
        size: 69420,
        duration: 145,
      });
    });
  });

  describe('when the file is an animation', () => {
    const extensions = ['.mp4', '.webm', '.mkv', '.mov', '.apng', '.gif'];

    test.each(extensions)('should return animation metadata for extension %p', async extension => {
      const file = 'toto' + extension;

      mocks.getAnimationMetadata.mockResolvedValue({
        size: 69420,
        duration: 145,
        width: 1456,
        height: 845,
        frameRate: 60,
        frameCount: 365,
      });

      const result = await getFileMetadata(file);

      expect(result).toEqual({
        size: 69420,
        duration: 145,
        width: 1456,
        height: 845,
        frameRate: 60,
        frameCount: 365,
      });
    });
  });

  describe('when the file is a flash', () => {
    const extensions = ['.swf'];

    test.each(extensions)('should return flash metadata for extension %p', async extension => {
      const file = 'toto' + extension;

      mocks.getFlashMetadata.mockResolvedValue({
        size: 69420,
      });

      const result = await getFileMetadata(file);

      expect(result).toEqual({
        size: 69420,
      });
    });
  });
});
