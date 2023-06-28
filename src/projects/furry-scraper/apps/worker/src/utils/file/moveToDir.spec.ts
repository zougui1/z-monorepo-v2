import { moveToDir } from './moveToDir';

const mocks = {
  rename: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    rename: (...args: any[]) => mocks.rename(...args),
  };
});

describe('moveToDir', () => {
  afterEach(() => {
    mocks.rename.mockReset();
    jest.clearAllMocks();
  });

  it('should move the file to the specified dir', async () => {
    const file = 'good/dragon.png';
    const dir = 'great';

    const result = await moveToDir(file, dir);

    expect(result).toBe('great/dragon.png');
    expect(mocks.rename).toBeCalledTimes(1);
    expect(mocks.rename).toBeCalledWith(file, 'great/dragon.png');
  });
});
