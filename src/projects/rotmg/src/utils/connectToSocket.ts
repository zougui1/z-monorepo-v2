import type { Socket } from 'node:net';

import { createSocketClient } from './createSocketClient';

export const connectToSocket = (host: string, port: number): Promise<Socket> => {
  //return Promise.reject('rejected')
  const client = createSocketClient(host, port);

  return new Promise<Socket>((resolve, reject) => {
    const cleanup = () => {
      client.off('connect', handleConnect);
      client.off('error', handleError);
    }

    const handleConnect = () => {
      cleanup();
      resolve(client);
    }

    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    }

    client.once('connect', handleConnect);
    client.once('error', handleError);
  });
}
