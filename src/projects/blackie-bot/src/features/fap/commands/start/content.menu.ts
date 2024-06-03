import { StartService } from './start.service';
import { compact, getChannelEnv } from '../../../../utils';
import { StringSelectMenuComponent } from '../../../../discord/component/components';
import { FapContentType } from '../../FapContentType';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export const contentMenu = new StringSelectMenuComponent('fap-content')
  .onCreate<ContentMenuButtonOptions>(context => {
    const options = Object.values(FapContentType).map(content => {
      return {
        label: content,
        value: content,
        default: content === context.options.defaultContent,
      };
    });

    return context.builder.setPlaceholder('Content').setOptions(options);
  })
  .action(async context => {
    const [value] = context.interaction.values;
    const message = await context.interaction.deferUpdate({ fetchReply: true });
    const startService = new StartService(getChannelEnv(context.interaction.channelId));
    const fap = await startService.findByMessageId(message.id);

    await startService.updateByMessageId(message.id, { content: value as FapContentType })


    const menuRow = fap && new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      contentMenu.create({
        defaultContent: value as FapContentType,
      }),
    );

    const [originalButtonRow, originalMenuRow] = message.components;

    const contentParts = fap && message.content.split(fap.content);
    const newContent = contentParts
      ? [
        // preserve the original content type for the warning (that is optional)
        contentParts.slice(0, -1).join(fap.content),
        ...contentParts.slice(-1)
        // repladce the old content type with the new one
      ].join(value)
      : message.content;

    console.log(contentParts && [
      // preserve the original content type for the warning (that is optional)
      contentParts.slice(0, -1).join(fap.content),
      ...contentParts.slice(-1)
      // repladce the old content type with the new one
    ])
    await context.interaction.message.edit({
      content: newContent,
      components: compact([originalMenuRow && originalButtonRow, menuRow]),
    });
  });

export interface ContentMenuButtonOptions {
  defaultContent: FapContentType;
}
