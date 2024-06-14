import { Readable } from 'node:stream';

import { readBytes } from './readBytes';

const mocks = {
  createReadStream: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    createReadStream: (...args: any[]) => mocks.createReadStream(...args),
  };
});

afterEach(() => {
  mocks.createReadStream.mockReset();
  jest.clearAllMocks();
});

describe('readBytes', () => {
  it('should resolve when the stream closes', async () => {
    const filePath = 'path/to/file.png';

    const stream = new Readable({
      read() {}
    });

    // `fs.ReadStream` has a method close that `Readable` does not have
    const close = jest.fn();
    (stream as any).close = close;

    mocks.createReadStream.mockReturnValue(stream);

    const promise = readBytes(filePath);
    stream.push(Buffer.from('rgsfdfrgsf'));
    stream.push(null);

    const result = await promise;

    expect(result).toEqual(Buffer.from('rgsfdfrgsf'));
    expect(mocks.createReadStream).toBeCalledWith(filePath, {
      highWatermark: undefined,
    });
    expect(close).toBeCalledTimes(1);
  });

  it('should reject when the stream errors', async () => {
    const filePath = 'path/to/file.png';

    const stream = new Readable({
      read() {}
    });

    // `fs.ReadStream` has a method close that `Readable` does not have
    const close = jest.fn();
    (stream as any).close = close;

    mocks.createReadStream.mockReturnValue(stream);

    const promise = readBytes(filePath);
    stream.emit('error', new Error('oh no'));
    stream.push(null);

    await expect(promise).rejects.toThrowError();
    expect(mocks.createReadStream).toBeCalledWith(filePath, {
      highWatermark: undefined,
    });
    expect(close).toBeCalledTimes(1);
  });
});
