import { Readable, Writable } from 'node:stream';

import axios from 'axios';

import { downloadFile } from './downloadFile';

const mocks = {
  createWriteStream: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    createWriteStream: (...args: any[]) => mocks.createWriteStream(...args),
  };
});

describe('downloadFile', () => {
  afterEach(() => {
    mocks.createWriteStream.mockReset();
    jest.clearAllMocks();
  });

  it('should a file from the URL and write it to the specified file', async () => {
    const url = 'https://d.furaffinity.net/oesjghreufgh';
    const output = 'dragons/sexy.png';
    const spyOnWrite = jest.fn();

    const readStream = new Readable();
    readStream.push(Buffer.from('toto'));
    readStream.push(null);

    const writeStream = new Writable();
    writeStream._write = function (chunk, encoding, callback) {
      spyOnWrite(chunk);
      callback();
    }

    jest.spyOn(axios, 'get').mockResolvedValue({
      data: readStream,
    });

    mocks.createWriteStream.mockReturnValue(writeStream);

    await downloadFile(url, output);

    expect(spyOnWrite).toBeCalledTimes(1);
    expect(spyOnWrite).toBeCalledWith(Buffer.from('toto'));
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(url, { responseType: 'stream' });
    expect(mocks.createWriteStream).toBeCalledTimes(1);
    expect(mocks.createWriteStream).toBeCalledWith(output);
  });

  it('should reject when the stream errors', async () => {
    const url = 'https://d.furaffinity.net/oesjghreufgh';
    const output = 'dragons/sexy.png';
    const spyOnWrite = jest.fn();

    const readStream = new Readable();
    readStream.push(Buffer.from('toto'));
    readStream.push(null);
    const errorMessage = 'oh no';

    const writeStream = new Writable();
    writeStream._write = function (chunk, encoding, callback) {
      spyOnWrite(chunk);
      callback(new Error(errorMessage));
    }

    jest.spyOn(axios, 'get').mockResolvedValue({
      data: readStream,
    });

    mocks.createWriteStream.mockReturnValue(writeStream);

    const getResult = () => downloadFile(url, output);

    await expect(getResult).rejects.toThrowError(errorMessage);
    expect(spyOnWrite).toBeCalledTimes(1);
    expect(spyOnWrite).toBeCalledWith(Buffer.from('toto'));
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(url, { responseType: 'stream' });
    expect(mocks.createWriteStream).toBeCalledTimes(1);
    expect(mocks.createWriteStream).toBeCalledWith(output);
  });
});
