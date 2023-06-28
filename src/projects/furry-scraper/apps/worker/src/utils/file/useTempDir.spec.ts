import path from 'node:path';

import { useTempDir } from './useTempDir';

const mocks = {
  ensureDir: jest.fn(),
  remove: jest.fn(),
  nanoid: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    ensureDir: (...args: any[]) => mocks.ensureDir(...args),
    remove: (...args: any[]) => mocks.remove(...args),
  };
});

jest.mock('nanoid', () => {
  return {
    nanoid: (...args: any[]) => mocks.nanoid(...args),
  };
});

describe('useTempDir', () => {
  afterEach(() => {
    mocks.ensureDir.mockReset();
    mocks.remove.mockReset();
    mocks.nanoid.mockReset();
    jest.clearAllMocks();
  });

  it('should ensure that the dir exists and remove it when the action resolved', async () => {
    const dir = 'great';
    const action = jest.fn().mockResolvedValue('returned value!');
    const id = 'ofdghudsrhvrsd';

    mocks.nanoid.mockReturnValue(id);

    const result = await useTempDir(dir, action);

    expect(result).toBe('returned value!');

    expect(mocks.ensureDir).toBeCalledTimes(1);
    expect(mocks.ensureDir).toBeCalledWith(path.join(dir, id));

    expect(mocks.remove).toBeCalledTimes(1);
    expect(mocks.remove).toBeCalledWith(path.join(dir, id));

    expect(action).toBeCalledTimes(1);
    expect(action).toBeCalledWith(path.join(dir, id), id);
  });

  it('should ensure that the dir exists and remove it when the action rejected', async () => {
    const dir = 'great';
    const action = jest.fn().mockRejectedValue(new Error('oh no'));
    const id = 'ofdghudsrhvrsd';

    mocks.nanoid.mockReturnValue(id);

    const getResult = () => useTempDir(dir, action);

    await expect(getResult).rejects.toThrowError('oh no');

    expect(mocks.ensureDir).toBeCalledTimes(1);
    expect(mocks.ensureDir).toBeCalledWith(path.join(dir, id));

    expect(mocks.remove).toBeCalledTimes(1);
    expect(mocks.remove).toBeCalledWith(path.join(dir, id));

    expect(action).toBeCalledTimes(1);
    expect(action).toBeCalledWith(path.join(dir, id), id);
  });
});
