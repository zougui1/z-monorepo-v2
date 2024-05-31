// @ts-nocheck
import z from 'zod';
import { ActionRowBuilder, ButtonStyle, GatewayIntentBits } from 'discord.js';

import { Client } from './discord/client';
import { Command, CommandGroup } from './discord/command';
import { Option } from './discord/option';
import { DISCORD_TOKEN } from './env';



import {
  StringSelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,

  StringSelectMenuBuilder,
  ButtonBuilder,
  ModalBuilder,
} from 'discord.js';
import { BaseComponent } from './discord/component/BaseComponent';

class ButtonComponent extends BaseComponent<ButtonInteraction, ButtonBuilder> {
  constructor(name: string) {
    super('button', ButtonBuilder, name);
  }
}

const newSeasonButton = new ButtonComponent('new-season')
  .onCreate(({ builder }) => {
    return builder.setLabel('New Season').setStyle(ButtonStyle.Primary);
  })
  .action(async context => {
    //context.interaction.
    //await context.response.send('new!');
  });



const wait = (timeout: number) => new Promise(r => setTimeout(r, timeout));

const fap = new CommandGroup('fap', 'Fap command');
const fapStart = new Command('start', 'Start fapping')
  .option('content', 'type of content', z.enum(['Art', 'Story']).default('Art'))
  .action(async context => {
    //await context.interaction.deferReply();
    //await wait(30_000);
    console.log('interaction', context.interaction)
    console.log('command id', context.interaction.command?.id)
    console.log('interaction id', context.interaction.id)
    const button = newSeasonButton.create();
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    context.response.components = [row];
    await context.response.send('started fapping', {
      components: [row],
    });
  });
const fapEnd = new Command('end', 'End fapping')
  .option('content', 'type of content', z.enum(['Art', 'Story']).default('Art'))
  .action(async context => {
    //await context.interaction.deferReply();
    //await wait(30_000);
    await context.response.send('ended fapping');
  });
const fapCancel = new Command('cancel', 'Cancel fapping')
  .option('content', 'type of content', z.enum(['Art', 'Story']).default('Art'))
  .action(async context => {
    //await context.interaction.deferReply();
    //await wait(30_000);
    await context.response.send('canceled fapping');
  });

fap.addSubCommand(fapStart);
fap.addSubCommand(fapEnd);
fap.addSubCommand(fapCancel);

const createClient = async (): Promise<void> => {
  const client = new Client({
    clientId: '1245369172373016647',
    token: DISCORD_TOKEN,
    intents: [
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
    ],
  });

  client.addCommand(fap);

  await client.start();
  console.log('started')
}

createClient().catch(error => console.log(error));
