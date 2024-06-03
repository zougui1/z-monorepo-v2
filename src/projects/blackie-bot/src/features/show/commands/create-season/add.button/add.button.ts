import { ButtonStyle } from 'discord.js';

import { newSeasonModal } from '../new-season.modal/season.modal';
import { createSeason } from '../create-season.command';
import { ShowService } from '../../../show.service';
import { getChannelEnv } from '../../../../../utils';
import { ButtonComponent } from '../../../../../discord/component/components';
import { DiscordInteractionService } from '../../../../common';

export const addButton = new ButtonComponent('add-season-button')
  .addComponent(newSeasonModal)
  .onCreate(context => {
    return context.builder.setLabel('Add Season').setStyle(ButtonStyle.Primary);
  })
  .action(async context => {
    const interactionService = new DiscordInteractionService(getChannelEnv(context.interaction.channelId));
    const showService = new ShowService(getChannelEnv(context.interaction.channelId));

    const savedInteraction = await interactionService.getByMessageId(
      context.interaction.message.id,
      createSeason.options.toSchema(),
    );

    const show = await showService.findOrCreateShow(savedInteraction.data);

    const modal = newSeasonModal.create({
      showName: show.name,
      seasonIndex: show.seasons.length + 1,
    });

    await context.interaction.showModal(modal);
  });
