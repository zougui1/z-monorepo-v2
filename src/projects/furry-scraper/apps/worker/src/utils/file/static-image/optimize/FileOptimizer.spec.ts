import { FileOptimizer } from './FileOptimizer';

const mocks = {
  sharp: jest.fn(),
  findOptimalSize: jest.fn(),
};

jest.mock('sharp', () => {
  return (...args: any[]) => mocks.sharp(...args);
});

jest.mock('./findOptimalSize', () => {
  return {
    findOptimalSize: (...args: any[]) => mocks.findOptimalSize(...args),
  };
});

describe('FileOptimizer', () => {
  afterEach(() => {
    mocks.sharp.mockReset();
    mocks.findOptimalSize.mockReset();
    jest.clearAllMocks();
  });

  describe('no reformatting', () => {
    it('should do nothing', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const result = await new FileOptimizer(inputFile)
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: undefined,
        webp: undefined,
        avif: undefined,
      });
      expect(mocks.sharp).not.toBeCalled();
    });
  });

  describe('to jpeg', () => {
    it('should reformat to jpeg without options', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const optimalSize = {
        width: undefined,
        height: 200,
      };

      const subMocks = {
        resize: jest.fn().mockImplementationOnce((): any => subMocks),
        jpeg: jest.fn().mockImplementation((): any => ({ toFile: subMocks.jpeg_toFile })),
        jpeg_toFile: jest.fn().mockReturnValue('reformatted to jpeg!'),
      };

      mocks.findOptimalSize.mockResolvedValue(optimalSize);
      mocks.sharp.mockReturnValue({
        resize: subMocks.resize,
      });

      const result = await new FileOptimizer(inputFile)
        .resize({ height: 200, maxWidth: 300 })
        .jpeg()
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: {
          details: 'reformatted to jpeg!',
          file: 'output/dragons/sexy-stuff.jpg',
        },
        webp: undefined,
        avif: undefined,
      });

      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(inputFile);

      expect(mocks.findOptimalSize).toBeCalledTimes(1);
      expect(mocks.findOptimalSize).toBeCalledWith(inputFile, { height: 200, maxWidth: 300 });

      expect(subMocks.resize).toBeCalledTimes(1);
      expect(subMocks.resize).toBeCalledWith(optimalSize.width, optimalSize.height);

      expect(subMocks.jpeg).toBeCalledTimes(1);
      expect(subMocks.jpeg).toBeCalledWith({});

      expect(subMocks.jpeg_toFile).toBeCalledTimes(1);
      expect(subMocks.jpeg_toFile).toBeCalledWith('output/dragons/sexy-stuff.jpg');
    });

    it('should reformat to jpeg with options', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const optimalSize = {
        width: undefined,
        height: 200,
      };

      const subMocks = {
        resize: jest.fn().mockImplementationOnce((): any => subMocks),
        jpeg: jest.fn().mockImplementation((): any => ({ toFile: subMocks.jpeg_toFile })),
        jpeg_toFile: jest.fn().mockReturnValue('reformatted to jpeg!'),
      };

      mocks.findOptimalSize.mockResolvedValue(optimalSize);
      mocks.sharp.mockReturnValue({
        resize: subMocks.resize,
      });

      const result = await new FileOptimizer(inputFile)
        .resize({ height: 200, maxWidth: 300 })
        .jpeg({ quality: 50 })
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: {
          details: 'reformatted to jpeg!',
          file: 'output/dragons/sexy-stuff.jpg',
        },
        webp: undefined,
        avif: undefined,
      });

      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(inputFile);

      expect(mocks.findOptimalSize).toBeCalledTimes(1);
      expect(mocks.findOptimalSize).toBeCalledWith(inputFile, { height: 200, maxWidth: 300 });

      expect(subMocks.resize).toBeCalledTimes(1);
      expect(subMocks.resize).toBeCalledWith(optimalSize.width, optimalSize.height);

      expect(subMocks.jpeg).toBeCalledTimes(1);
      expect(subMocks.jpeg).toBeCalledWith({ quality: 50 });

      expect(subMocks.jpeg_toFile).toBeCalledTimes(1);
      expect(subMocks.jpeg_toFile).toBeCalledWith('output/dragons/sexy-stuff.jpg');
    });
  });

  describe('to webp', () => {
    it('should reformat to webp without options', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const optimalSize = {
        width: undefined,
        height: 200,
      };

      const subMocks = {
        resize: jest.fn().mockImplementationOnce((): any => subMocks),
        webp: jest.fn().mockImplementation((): any => ({ toFile: subMocks.webp_toFile })),
        webp_toFile: jest.fn().mockReturnValue('reformatted to webp!'),
      };

      mocks.findOptimalSize.mockResolvedValue(optimalSize);
      mocks.sharp.mockReturnValue({
        resize: subMocks.resize,
      });

      const result = await new FileOptimizer(inputFile)
        .resize({ height: 200, maxWidth: 300 })
        .webp()
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: undefined,
        webp: {
          details: 'reformatted to webp!',
          file: 'output/dragons/sexy-stuff.webp',
        },
        avif: undefined,
      });

      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(inputFile);

      expect(mocks.findOptimalSize).toBeCalledTimes(1);
      expect(mocks.findOptimalSize).toBeCalledWith(inputFile, { height: 200, maxWidth: 300 });

      expect(subMocks.resize).toBeCalledTimes(1);
      expect(subMocks.resize).toBeCalledWith(optimalSize.width, optimalSize.height);

      expect(subMocks.webp).toBeCalledTimes(1);
      expect(subMocks.webp).toBeCalledWith({});

      expect(subMocks.webp_toFile).toBeCalledTimes(1);
      expect(subMocks.webp_toFile).toBeCalledWith('output/dragons/sexy-stuff.webp');
    });

    it('should reformat to webp with options', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const optimalSize = {
        width: undefined,
        height: 200,
      };

      const subMocks = {
        resize: jest.fn().mockImplementationOnce((): any => subMocks),
        webp: jest.fn().mockImplementation((): any => ({ toFile: subMocks.webp_toFile })),
        webp_toFile: jest.fn().mockReturnValue('reformatted to webp!'),
      };

      mocks.findOptimalSize.mockResolvedValue(optimalSize);
      mocks.sharp.mockReturnValue({
        resize: subMocks.resize,
      });

      const result = await new FileOptimizer(inputFile)
        .resize({ height: 200, maxWidth: 300 })
        .webp({ quality: 50 })
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: undefined,
        webp: {
          details: 'reformatted to webp!',
          file: 'output/dragons/sexy-stuff.webp',
        },
        avif: undefined,
      });

      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(inputFile);

      expect(mocks.findOptimalSize).toBeCalledTimes(1);
      expect(mocks.findOptimalSize).toBeCalledWith(inputFile, { height: 200, maxWidth: 300 });

      expect(subMocks.resize).toBeCalledTimes(1);
      expect(subMocks.resize).toBeCalledWith(optimalSize.width, optimalSize.height);

      expect(subMocks.webp).toBeCalledTimes(1);
      expect(subMocks.webp).toBeCalledWith({ quality: 50 });

      expect(subMocks.webp_toFile).toBeCalledTimes(1);
      expect(subMocks.webp_toFile).toBeCalledWith('output/dragons/sexy-stuff.webp');
    });
  });

  describe('to avif', () => {
    it('should reformat to avif without options', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const optimalSize = {
        width: undefined,
        height: 200,
      };

      const subMocks = {
        resize: jest.fn().mockImplementationOnce((): any => subMocks),
        avif: jest.fn().mockImplementation((): any => ({ toFile: subMocks.avif_toFile })),
        avif_toFile: jest.fn().mockReturnValue('reformatted to avif!'),
      };

      mocks.findOptimalSize.mockResolvedValue(optimalSize);
      mocks.sharp.mockReturnValue({
        resize: subMocks.resize,
      });

      const result = await new FileOptimizer(inputFile)
        .resize({ height: 200, maxWidth: 300 })
        .avif()
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: undefined,
        webp: undefined,
        avif: {
          details: 'reformatted to avif!',
          file: 'output/dragons/sexy-stuff.avif',
        },
      });

      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(inputFile);

      expect(mocks.findOptimalSize).toBeCalledTimes(1);
      expect(mocks.findOptimalSize).toBeCalledWith(inputFile, { height: 200, maxWidth: 300 });

      expect(subMocks.resize).toBeCalledTimes(1);
      expect(subMocks.resize).toBeCalledWith(optimalSize.width, optimalSize.height);

      expect(subMocks.avif).toBeCalledTimes(1);
      expect(subMocks.avif).toBeCalledWith({});

      expect(subMocks.avif_toFile).toBeCalledTimes(1);
      expect(subMocks.avif_toFile).toBeCalledWith('output/dragons/sexy-stuff.avif');
    });

    it('should reformat to avif with options', async () => {
      const inputFile = 'dragons/sexy-stuff.png';
      const dir = 'output/dragons';

      const optimalSize = {
        width: undefined,
        height: 200,
      };

      const subMocks = {
        resize: jest.fn().mockImplementationOnce((): any => subMocks),
        avif: jest.fn().mockImplementation((): any => ({ toFile: subMocks.avif_toFile })),
        avif_toFile: jest.fn().mockReturnValue('reformatted to avif!'),
      };

      mocks.findOptimalSize.mockResolvedValue(optimalSize);
      mocks.sharp.mockReturnValue({
        resize: subMocks.resize,
      });

      const result = await new FileOptimizer(inputFile)
        .resize({ height: 200, maxWidth: 300 })
        .avif({ quality: 50 })
        .toFile({ dir });

      expect(result).toEqual({
        jpeg: undefined,
        webp: undefined,
        avif: {
          details: 'reformatted to avif!',
          file: 'output/dragons/sexy-stuff.avif',
        },
      });

      expect(mocks.sharp).toBeCalledTimes(1);
      expect(mocks.sharp).toBeCalledWith(inputFile);

      expect(mocks.findOptimalSize).toBeCalledTimes(1);
      expect(mocks.findOptimalSize).toBeCalledWith(inputFile, { height: 200, maxWidth: 300 });

      expect(subMocks.resize).toBeCalledTimes(1);
      expect(subMocks.resize).toBeCalledWith(optimalSize.width, optimalSize.height);

      expect(subMocks.avif).toBeCalledTimes(1);
      expect(subMocks.avif).toBeCalledWith({ quality: 50 });

      expect(subMocks.avif_toFile).toBeCalledTimes(1);
      expect(subMocks.avif_toFile).toBeCalledWith('output/dragons/sexy-stuff.avif');
    });
  });
});
