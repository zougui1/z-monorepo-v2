import { parallel } from 'radash';
import type { TextBasedChannel } from 'discord.js';

import { ClearService } from './clear.service';
import { Command } from '../../discord';
import { getChannelEnv } from '../../utils';
import { EnvType } from '../../EnvType';

const deleteChannelMessages = async (channel: TextBasedChannel): Promise<void> => {
  let hasMessages = true;

  while (hasMessages) {
    const messages = await channel.messages.fetch({ limit: 100 });
    hasMessages = messages.size > 0;

    await parallel(messages.size, [...messages.values()], async message => {
      await message.delete();
    });
  }
}

export const clear = new Command('clear', 'Clear the testing environment')
  .action(async context => {
    context.response.defer({ ephemeral: true });

    const envType = getChannelEnv(context.interaction.channelId);

    if (envType === EnvType.Production) {
      throw new Error('You cannot clear a production environment');
    }

    const clearService = new ClearService();
    await clearService.clear();

    if (context.interaction.channel) {
      await deleteChannelMessages(context.interaction.channel);
    }

    await context.response.sendSuccess('The testing environment has been cleared');
  });
