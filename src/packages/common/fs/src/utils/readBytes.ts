import { finished } from 'node:stream/promises'

import fs from 'fs-extra';
import { tryit } from 'radash';

export const readBytes = async (filePath: string, options?: ReadBytesOptions | undefined): Promise<Buffer> => {
  const stream = fs.createReadStream(filePath, {
    highWaterMark: options?.size,
  });
  const [error, buffer] = await tryit(readChunk)(stream);

  const promise = finished(stream);
  stream.close();
  await promise;

  if (error) {
    throw error;
  }

  return buffer;
}

const readChunk = async (stream: fs.ReadStream): Promise<Buffer> => {
  const promisedBuffer = new Promise<Buffer>((resolve, reject) => {
    stream.on('data', buffer => resolve(Buffer.from(buffer)));
    stream.on('error', reject);
  });
  stream.read();

  return await promisedBuffer;
}

export interface ReadBytesOptions {
  size?: number | undefined;
}
