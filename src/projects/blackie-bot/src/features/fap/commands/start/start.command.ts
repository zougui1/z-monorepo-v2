import { DateTime } from 'luxon';

import { StartService } from './start.service';
import { endButton } from '../end';
import { cancelButton } from '../cancel';
import { FapContentType } from '../../FapContentType';
import { Command } from '../../../../discord';
import { createContentOptionWithDefaultValue } from '../../content.option';
import { compact, getChannelEnv } from '../../../../utils';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { contentMenu } from './content.menu';
import { StringSelectMenuBuilder } from 'discord.js';

export const start = new Command('start', 'Start fapping')
  .addOption(createContentOptionWithDefaultValue({ defaultValue: FapContentType.Art }))
  .addComponent(endButton)
  .addComponent(cancelButton)
  .addComponent(contentMenu)
  .action(async context => {
    console.time('start')
    const messagePromise = context.response.defer();

    const startService = new StartService(getChannelEnv(context.interaction.channelId));
    const unfinishedFap = await startService.getUnfinishedFap();

    if (unfinishedFap) {
      const relativeTime = unfinishedFap.startDate.toRelative();
      const content = unfinishedFap.content;

      context.response.addWarning(`You forgot to stop fapping! You started fapping to ${content} ${relativeTime}`);
    }

    const message = await messagePromise;

    await startService.createFap({
      ...context.options,
      date: DateTime.now(),
      messageId: message.id,
    });

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      endButton.create({}),
      cancelButton.create({}),
    );

    const fap = await startService.findByMessageId(message.id);

    const menuRow = fap && new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      contentMenu.create({
        defaultContent: fap.content,
      }),
    );

    await context.response.sendSuccess(`You started fapping to ${context.options.content}`, {
      components: compact([buttonRow, menuRow]),
    });
    console.timeEnd('start')
  });
