import { GatewayIntentBits } from 'discord.js';
import { Server, Socket } from 'socket.io';
import { io } from 'socket.io-client';
import Emittery from 'emittery';

import { Client } from './discord';
import { fap, clear } from './features';
import { authorizer } from './middlewares';
import { env } from './env';
import { config } from './config';

const port = 11445;
const domain = 'http://localhost';

const wait = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export interface ServerSocketEventMap {
  connectionChange: { connectedClients: number };
}

class ServerSocket extends Emittery<ServerSocketEventMap> {
  readonly io = new Server();
  #sockets = new Set<Socket>();
  #connectionChanged = false;

  constructor() {
    super();

    this.io.listen(port);

    this.io.on('connection', socket => {
      this.#connectionChanged = true;
      this.#sockets.add(socket);
      this._emitConnectionChange();

      socket.on('disconnect', () => {
        this.#sockets.delete(socket);
        this._emitConnectionChange();
      });
    });

    // wait 5 seconds before emitting a fake connection change
    // for the initial initialization, only if it hasn't been emitted yet
    setTimeout(() => {
      if (!this.#connectionChanged) {
        this._emitConnectionChange();
      }
    }, 5000);
  }

  private _emitConnectionChange = (): void => {
    this.emit('connectionChange', {
      connectedClients: this.#sockets.size,
    });
  }
}

class ClientSocket {
  readonly socket = io(`${domain}:${port}`);

  waitStatus = async (): Promise<{ isRunning: boolean }> => {
    return new Promise(resolve => {
      const handleConnect = () => {
        cleanup();
        resolve({ isRunning: true });
      }

      const handleDisconnect = () => {
        cleanup();
        resolve({ isRunning: false });
      }

      const cleanup = () => {
        this.socket.off('connect', handleConnect);
        this.socket.off('connect_error', handleDisconnect);
        this.socket.off('disconnect', handleDisconnect);
      }

      this.socket.once('connect', handleConnect);
      this.socket.once('connect_error', handleDisconnect);
      this.socket.once('disconnect', handleDisconnect);
    });
  }
}

const startBot = async (): Promise<Client> => {
  console.log('starting up bot...');

  const discord = new Client({
    clientId: env.discord.clientId,
    token: env.discord.token,
    intents: [
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
    ],
  });

  discord.use(authorizer({
    authorizedUserIds: config.discord.authorizedUserIds,
  }));

  discord.addCommand(fap);
  discord.addCommand(clear);

  console.log('starting')
  await discord.start();

  const guildList = await discord.client.guilds.fetch();
  const channelIds = [
    ...config.discord.production.channelIds,
    ...config.discord.test.channelIds,
  ];

  for (const guildItem of guildList.values()) {
    const guild = await guildItem.fetch();
    const channelList = await guild.channels.fetch();

    for (const channelItem of channelList.values()) {
      if (channelItem && channelIds.includes(channelItem.id)) {
        await channelItem?.fetch();
      }
    }
  }

  console.log('bot started');

  return discord;
}

export const program = async (): Promise<void> => {
  if (env.mode === 'server') {
    const server = new ServerSocket();
    let discord: Client | undefined;

    server.on('connectionChange', async ({ connectedClients }) => {
      if (connectedClients) {
        await discord?.destroy();
        console.log('server: bot stopped');
        server.io.emit('bot-stopped');
        return;
      }

      discord = await startBot();
      console.log('server: start bot');
    });
  } else {
    const client = new ClientSocket();
    const botStoppedPromise = new Promise(resolve => client.socket.once('bot-stopped', resolve));
    const status = await client.waitStatus();

    console.log('client: status:', status.isRunning);

    if (status.isRunning) {
      console.log('client: wait for server to stop the bot');
      await botStoppedPromise;
    }

    console.log('client: start bot');
    await startBot();
  }

}
