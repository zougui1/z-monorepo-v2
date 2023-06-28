import { processPreview } from './processPreview';
import env from '../../../../env';

const mocks = {
  ensureDir: jest.fn(),
};

class MockFileOptimizer {
  static readonly _constructor = jest.fn();
  static readonly resize = jest.fn();
  static readonly jpeg = jest.fn();
  static readonly webp = jest.fn();
  static readonly avif = jest.fn();
  static readonly toFile = jest.fn();

  static cleanup() {
    this.resize.mockReset();
    this.jpeg.mockReset();
    this.webp.mockReset();
    this.avif.mockReset();
    this.toFile.mockReset();
  }

  constructor(...args: any[]) {
    MockFileOptimizer._constructor(...args);
  }

  resize = (...args: any[]): this => {
    MockFileOptimizer.resize(...args);
    return this;
  }

  jpeg = (...args: any[]): this => {
    MockFileOptimizer.jpeg(...args);
    return this;
  }

  webp = (...args: any[]): this => {
    MockFileOptimizer.webp(...args);
    return this;
  }

  avif = (...args: any[]): this => {
    MockFileOptimizer.avif(...args);
    return this;
  }

  toFile = (...args: any[]) => MockFileOptimizer.toFile(...args);
}

jest.mock('fs-extra', () => {
  return {
    ensureDir: (...args: any[]) => mocks.ensureDir(...args),
  };
});

jest.mock('../../../../utils', () => {
  return {
    FileOptimizer: jest.fn().mockImplementation((...args: any[]) => {
      return new MockFileOptimizer(...args);
    }),
  };
});

describe('processPreview', () => {
  afterEach(() => {
    MockFileOptimizer.cleanup();
    jest.clearAllMocks();
  });

  it('should throw an error when the result is missing jpeg', async () => {
    const tempFile = 'dragons/sexy-stuff.png';

    mocks.ensureDir.mockResolvedValue(undefined);
    MockFileOptimizer.toFile.mockResolvedValue({
      webp: {
        file: 'dragons/sexy-stuff.webp',
      },
      avif: {
        file: 'dragons/sexy-stuff.avif',
      },
    });

    const getResult = () => processPreview(tempFile);

    await expect(getResult).rejects.toThrowError(/could not create samples/i);
  });

  it('should throw an error when the result is missing webp', async () => {
    const tempFile = 'dragons/sexy-stuff.png';

    mocks.ensureDir.mockResolvedValue(undefined);
    MockFileOptimizer.toFile.mockResolvedValue({
      jpeg: {
        file: 'dragons/sexy-stuff.jpg',
      },
      avif: {
        file: 'dragons/sexy-stuff.avif',
      },
    });

    const getResult = () => processPreview(tempFile);

    await expect(getResult).rejects.toThrowError(/could not create samples/i);
  });

  it('should throw an error when the result is missing avif', async () => {
    const tempFile = 'dragons/sexy-stuff.png';

    mocks.ensureDir.mockResolvedValue(undefined);
    MockFileOptimizer.toFile.mockResolvedValue({
      jpeg: {
        file: 'dragons/sexy-stuff.jpg',
      },
      webp: {
        file: 'dragons/sexy-stuff.webp',
      },
    });

    const getResult = () => processPreview(tempFile);

    await expect(getResult).rejects.toThrowError(/could not create samples/i);
  });

  it('should return the results of the optimized image', async () => {
    const tempFile = 'dragons/sexy-stuff.png';

    mocks.ensureDir.mockResolvedValue(undefined);
    MockFileOptimizer.toFile.mockResolvedValue({
      jpeg: {
        file: 'dragons/sexy-stuff.jpg',
      },
      webp: {
        file: 'dragons/sexy-stuff.webp',
      },
      avif: {
        file: 'dragons/sexy-stuff.avif',
      },
    });

    const result = await processPreview(tempFile);

    expect(result).toEqual({
      original: 'dragons/sexy-stuff.jpg',
      sample: {
        webp: 'dragons/sexy-stuff.webp',
        avif: 'dragons/sexy-stuff.avif',
      },
    });
    expect(MockFileOptimizer.resize).toBeCalledWith(env.processing.preview.resize);
    expect(MockFileOptimizer.jpeg).toBeCalledWith(env.processing.preview.jpeg);
    expect(MockFileOptimizer.webp).toBeCalledWith(env.processing.preview.webp);
    expect(MockFileOptimizer.avif).toBeCalledWith(env.processing.preview.avif);
    expect(MockFileOptimizer.toFile).toBeCalledWith({
      dir: 'dragons/samples',
    });
  });
});
