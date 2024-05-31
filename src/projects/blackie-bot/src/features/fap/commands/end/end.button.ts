import { ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { DateTime } from 'luxon';

import { EndService } from './end.service';
import { getChannelEnv } from '../../../../utils';
import { ButtonComponent } from '../../../../discord/component/components';
import { contentMenu } from '../start/content.menu';

export const endButton = new ButtonComponent('end-fap')
  .onCreate(context => {
    return context.builder.setLabel('End').setStyle(ButtonStyle.Primary);
  })
  .action(async context => {
    const messagePromise = context.interaction.deferUpdate({ fetchReply: true });

    const endService = new EndService(getChannelEnv(context.interaction.channelId));

    const message = await messagePromise;
    const fap = await endService.findByMessageId(message.id);

    if (!fap) {
      return
    }

    const { duration, content } = await endService.finishLastFap({
      messageId: context.interaction.message.id,
      endDate: DateTime.now(),
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
        content: `✅\nYou finished fapping${contentMessage} after ${duration}`,
      }),
      context.interaction.message.edit({
        components: [menuRow],
      }),
    ]);
  });
