import { GatewayIntentBits } from 'discord.js';

import { Client } from './discord';
import { fap, clear } from './features';
import { authorizer } from './middlewares';
import { env } from './env';
import { config } from './config';
import { ServerSocket, ClientSocket } from './socket';

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
    authorizedUserIds: config.production.discord.authorizedUserIds,
  }));

  discord.addCommand(fap);
  discord.addCommand(clear);

  console.log('starting')
  await discord.start();

  const guildList = await discord.client.guilds.fetch();
  const channelIds = [
    ...config.production.discord.channelIds,
    ...config.development.discord.channelIds,
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

const serverProgram = async (): Promise<void> => {
  const server = new ServerSocket(config.production.socket);
  let discord: Client | undefined;

  server.on('connectionChange', async ({ connectedClients }) => {
    if (connectedClients) {
      console.log('client connected. stopping bot...');
      await discord?.destroy();
      console.log('bot stopped');
      server.io.emit('bot-stopped');
      return;
    }

    console.log('client disconnected');
    discord = await startBot();
  });
}

const clientProgram = async (): Promise<void> => {
  const client = new ClientSocket(config.production.socket);
  const botStoppedPromise = new Promise(resolve => client.socket.once('bot-stopped', resolve));
  const status = await client.waitStatus();

  if (status.isRunning) {
    console.log('waiting for server to stop the bot...');
    await botStoppedPromise;
  }

  await startBot();
}

export const program = async (): Promise<void> => {
  if (env.nodeEnv === 'production') {
    await serverProgram();
  } else {
    await clientProgram();
  }
}
