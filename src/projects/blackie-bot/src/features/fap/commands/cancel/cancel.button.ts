import { ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { DateTime } from 'luxon';

import { CancelService } from './cancel.service';
import { getChannelEnv } from '../../../../utils';
import { ButtonComponent } from '../../../../discord/component/components';
import { contentMenu } from '../start/content.menu';

export const cancelButton = new ButtonComponent('cancel-fap')
  .onCreate(context => {
    return context.builder.setLabel('Cancel').setStyle(ButtonStyle.Primary);
  })
  .action(async context => {
    const message = await context.interaction.deferUpdate({ fetchReply: true });
    const cancelService = new CancelService(getChannelEnv(context.interaction.channelId));
    const fap = await cancelService.findByMessageId(message.id);

    if (!fap) {
      return
    }

    const { duration, content } = await cancelService.deleteLastFap({
      date: DateTime.now(),
    });

    const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      contentMenu.create({
        defaultContent: fap.content,
      }),
    );

    const contentMessage = content ? ` to ${content}` : '';

    await Promise.all([
      context.interaction.channel?.send({
        reply: { messageReference: message.id },
        content: `✅\nYou canceled fapping${contentMessage} after ${duration}`,
      }),
      context.interaction.message.edit({
        components: [menuRow],
      }),
    ]);
  });
