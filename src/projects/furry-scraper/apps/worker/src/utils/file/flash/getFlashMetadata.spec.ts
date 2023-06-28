import { getFlashMetadata } from './getFlashMetadata';

const mocks = {
  stat: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    stat: (...args: any[]) => mocks.stat(...args),
  };
});

describe('getFlashMetadata', () => {
  afterEach(() => {
    mocks.stat.mockReset();
    jest.clearAllMocks();
  });

  it('should return the metadata of the flash file', async () => {
    const file = 'dragons/sexy-stuff.png';

    mocks.stat.mockResolvedValue({ size: 69420 });

    const result = await getFlashMetadata(file);

    expect(result).toEqual({
      size: 69420,
    });
    expect(mocks.stat).toBeCalledTimes(1);
    expect(mocks.stat).toBeCalledWith(file);
  });
});
