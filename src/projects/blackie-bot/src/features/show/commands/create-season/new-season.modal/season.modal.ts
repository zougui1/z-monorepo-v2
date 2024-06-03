import { sum, tryit } from 'radash';
import { ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

import { parseEpisodeInput } from './utils';
import { createSeason } from '../create-season.command';
import { getChannelEnv } from '../../../../../utils';
import { ModalComponent } from '../../../../../discord/component/components';
import { DiscordInteractionService } from '../../../../common';
import { ShowService } from '../../../show.service';

const inputIds = {
  episodes: 'episodes',
};

export const newSeasonModal = new ModalComponent('new-season-modal')
  .onCreate<NewSeasonModalOptions>(context => {
    context.builder.setTitle(`${context.options.showName} - ${context.options.seasonIndex}`);

    const episodesInput = new TextInputBuilder()
      .setCustomId(inputIds.episodes)
      .setLabel('Episode durations (in minutes)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(episodesInput);
    context.builder.addComponents(row);

    return context.builder;
  })
  .action(async context => {
    const message = await context.interaction.deferUpdate({ fetchReply: true });
    const interactionService = new DiscordInteractionService(getChannelEnv(context.interaction.channelId || ''));
    const showService = new ShowService(getChannelEnv(context.interaction.channelId || ''));

    const savedInteraction = await interactionService.getByMessageId(
      message.id,
      createSeason.options.toSchema(),
    );

    const show = await showService.findOrCreateShow(savedInteraction.data);
    const newSeasonCount = show.seasons.length + 1;

    const episodeInput = context.interaction.fields.getTextInputValue(inputIds.episodes);
    const [error, episodes] = tryit(parseEpisodeInput)(episodeInput);

    if (error) {
      await context.interaction.editReply({
        content: `${message.content}\n❌ season ${newSeasonCount}: ${error.message}`,
      });
      return;
    }

    await showService.addSeason(savedInteraction.data.name, {
      duration: sum(episodes),
      episodeCount: episodes.length,
      index: newSeasonCount,
    });

    await context.interaction.editReply({
      content: `${message.content}\n✅ season ${newSeasonCount} created`,
    });
  });

export interface NewSeasonModalOptions {
  showName: string;
  seasonIndex: number;
}
