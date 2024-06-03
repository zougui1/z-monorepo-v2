import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

import { sourceOption, nameOption } from './options';
import { addButton } from './add.button/add.button';
import { ShowService } from '../../show.service';
import { Command } from '../../../../discord';
import { getChannelEnv } from '../../../../utils';
import { DiscordInteractionService } from '../../../common';
import { InteractionType } from '../../../../discord/InteractionType';

export const createSeason = new Command('create-season', 'Create new seasons for a show')
  .addOption(nameOption)
  .addOption(sourceOption)
  .addComponent(addButton)
  .post(async context => {
    const message = await context.interaction.fetchReply();
    const interactionService = new DiscordInteractionService(getChannelEnv(context.interaction.channelId));

    await interactionService.create({
      messageId: message.id,
      type: InteractionType.Command,
      interactionId: [
        context.interaction.commandName,
        context.interaction.options.getSubcommand(false),
      ].filter(Boolean).join(' '),
      data: context.options,
    });
  })
  .action(async context => {
    await context.response.defer();

    const showService = new ShowService(getChannelEnv(context.interaction.channelId));
    const show = await showService.findOrCreateShow(context.options);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(addButton.create({}));

    const seasonCount = `${show.seasons.length} season${show.seasons.length === 1 ? '' : 's'}`;
    await context.response.sendSuccess(`${show.name} - ${seasonCount}`, {
      components: [row],
    });
  });
