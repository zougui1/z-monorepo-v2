import { processImage } from './processImage';
import env from '../../../../env';

const mocks = {
  ensureDir: jest.fn(),
};

class MockFileOptimizer {
  static readonly _constructor = jest.fn();
  static readonly resize = jest.fn();
  static readonly webp = jest.fn();
  static readonly avif = jest.fn();
  static readonly toFile = jest.fn();

  static cleanup() {
    this.resize.mockReset();
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

describe('processImage', () => {
  afterEach(() => {
    MockFileOptimizer.cleanup();
    jest.clearAllMocks();
  });

  it('should throw an error when the result is missing webp', async () => {
    const tempFile = 'dragons/sexy-stuff.png';

    mocks.ensureDir.mockResolvedValue(undefined);
    MockFileOptimizer.toFile.mockResolvedValue({
      avif: {
        file: 'dragons/sexy-stuff.avif',
      },
    });

    const getResult = () => processImage(tempFile);

    await expect(getResult).rejects.toThrowError(/could not create samples/i);
  });

  it('should throw an error when the result is missing avif', async () => {
    const tempFile = 'dragons/sexy-stuff.png';

    mocks.ensureDir.mockResolvedValue(undefined);
    MockFileOptimizer.toFile.mockResolvedValue({
      webp: {
        file: 'dragons/sexy-stuff.webp',
      },
    });

    const getResult = () => processImage(tempFile);

    await expect(getResult).rejects.toThrowError(/could not create samples/i);
  });

  it('should return the results of the optimized image', async () => {
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

    const result = await processImage(tempFile);

    expect(result).toEqual({
      original: tempFile,
      sample: {
        webp: 'dragons/sexy-stuff.webp',
        avif: 'dragons/sexy-stuff.avif',
      },
    });
    expect(MockFileOptimizer.resize).toBeCalledWith(env.processing.image.resize);
    expect(MockFileOptimizer.webp).toBeCalledTimes(1);
    expect(MockFileOptimizer.avif).toBeCalledTimes(1);
    expect(MockFileOptimizer.toFile).toBeCalledWith({
      dir: 'dragons/samples',
    });
  });
});
