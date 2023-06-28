import { findOptimalSize, FindOptimalSizeOptions } from './findOptimalSize';

const mocks = {
  sharp: jest.fn(),
};

jest.mock('sharp', () => {
  return (...args: any[]) => mocks.sharp(...args);
});

describe('findOptimalSize', () => {
  afterEach(() => {
    mocks.sharp.mockReset();
    jest.clearAllMocks();
  });

  describe('when the original size could not be found', () => {
    it('should throw an error when the width could not be found', async () => {
      const file = 'dragons/sexy-stuff.png';
      const options: FindOptimalSizeOptions = {
        height: 200,
      };

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          height: 600,
        }),
      });

      const getResult = () => findOptimalSize(file, options);

      expect(getResult).rejects.toThrowError(/original size not found/i);
    });

    it('should throw an error when the height could not be found', async () => {
      const file = 'dragons/sexy-stuff.png';
      const options: FindOptimalSizeOptions = {
        height: 200,
      };

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          width: 600,
        }),
      });

      const getResult = () => findOptimalSize(file, options);

      expect(getResult).rejects.toThrowError(/original size not found/i);
    });
  });

  describe('when the optimal size could not be found', () => {
    it('should throw an error when both the width and height could not be found', async () => {
      const file = 'dragons/sexy-stuff.png';
      const options = {

      } as FindOptimalSizeOptions;

      mocks.sharp.mockReturnValue({
        metadata: async () => ({
          width: 300,
          height: 600,
        }),
      });

      const getResult = () => findOptimalSize(file, options);

      expect(getResult).rejects.toThrowError(/no optimal size found/i);
    });
  });

  describe('when the optimal size are within the constraints', () => {
    describe('when the sizes are numbers', () => {
      it('should return the optimal size for the height', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          height: 300,
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: undefined,
          height: 300,
        });
      });

      it('should return the optimal size for the width', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          width: 150,
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: 150,
          height: undefined,
        });
      });

      it('should return the optimal size for both the width and height', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          width: 150,
          height: 400,
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: 150,
          height: 400,
        });
      });
    });

    describe('when the sizes are percentages', () => {
      it('should return the optimal size for the height', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          height: '50%',
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: undefined,
          height: 300,
        });
      });

      it('should return the optimal size for the width', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          width: '50%',
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: 150,
          height: undefined,
        });
      });

      it('should return the optimal size for both the width and height', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          width: '50%',
          height: '66.66666%',
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: 150,
          height: 400,
        });
      });
    });
  });

  describe('when the optimal sizes are not within the constraints', () => {
    describe('when the sizes are numbers', () => {
      it('should calculate the optimal sizes', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          height: 300,
          maxHeight: 400,
          minWidth: 200,
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: 200,
          height: 400,
        });
      });
    });

    describe('when the sizes are percentages', () => {
      it('should calculate the optimal sizes', async () => {
        const file = 'dragons/sexy-stuff.png';
        const options: FindOptimalSizeOptions = {
          height: '50%',
          maxHeight: 400,
          minWidth: 200,
        };

        mocks.sharp.mockReturnValue({
          metadata: async () => ({
            width: 300,
            height: 600,
          }),
        });

        const result = await findOptimalSize(file, options);

        expect(result).toEqual({
          width: 200,
          height: 400,
        });
      });
    });
  });
});
