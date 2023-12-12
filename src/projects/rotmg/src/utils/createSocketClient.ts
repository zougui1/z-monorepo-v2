import net from 'node:net';

export const createSocketClient = (host: string, port: number): net.Socket => {
  const client = new net.Socket();
  client.connect(port, host);

  return client;
}
