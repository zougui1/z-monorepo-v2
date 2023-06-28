import { getAnimationMetadata } from './getAnimationMetadata';

const mocks = {
  stat: jest.fn(),
  getVideoMetadata: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    stat: (...args: any[]) => mocks.stat(...args),
  };
});

jest.mock('./getVideoMetadata', () => {
  return {
    getVideoMetadata: (...args: any[]) => mocks.getVideoMetadata(...args),
  };
});

describe('getAnimationMetadata', () => {
  afterEach(() => {
    mocks.stat.mockReset();
    mocks.getVideoMetadata.mockReset();
    jest.clearAllMocks();
  });

  it('should return the metadata of the animation file', async () => {
    const file = 'dragons/sexy-stuff.png';

    mocks.stat.mockResolvedValue({ size: 69420 });
    mocks.getVideoMetadata.mockResolvedValue({
      width: 486,
      height: 1546,
      frameRate: 60,
      frameCount: 1458,
      duration: 8,
    });

    const result = await getAnimationMetadata(file);

    expect(result).toEqual({
      size: 69420,
      width: 486,
      height: 1546,
      frameRate: 60,
      frameCount: 1458,
      duration: 8,
    });
    expect(mocks.stat).toBeCalledTimes(1);
    expect(mocks.stat).toBeCalledWith(file);
    expect(mocks.getVideoMetadata).toBeCalledTimes(1);
    expect(mocks.getVideoMetadata).toBeCalledWith(file);
  });

  it('should return the default metadata when they could not be found', async () => {
    const file = 'dragons/sexy-stuff.png';

    mocks.stat.mockResolvedValue({ size: 69420 });
    mocks.getVideoMetadata.mockResolvedValue({});

    const result = await getAnimationMetadata(file);

    expect(result).toEqual({
      size: 69420,
      width: -1,
      height: -1,
      frameRate: -1,
      frameCount: -1,
      duration: -1,
    });
    expect(mocks.stat).toBeCalledTimes(1);
    expect(mocks.stat).toBeCalledWith(file);
    expect(mocks.getVideoMetadata).toBeCalledTimes(1);
    expect(mocks.getVideoMetadata).toBeCalledWith(file);
  });
});
