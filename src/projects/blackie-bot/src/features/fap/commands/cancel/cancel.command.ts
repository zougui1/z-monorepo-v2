import { DateTime } from 'luxon';

import { CancelService } from './cancel.service';
import { Command } from '../../../../discord';
import { getChannelEnv } from '../../../../utils';

export const cancel = new Command('cancel', 'Cancel fapping')
  .action(async context => {
    context.response.defer();

    const cancelService = new CancelService(getChannelEnv(context.interaction.channelId));

    const { duration, content } = await cancelService.deleteLastFap({
      date: DateTime.now(),
    });

    const contentMessage = content ? ` to ${content}` : ''
    await context.response.sendSuccess(`You canceled fapping${contentMessage} after ${duration}`);
  });
