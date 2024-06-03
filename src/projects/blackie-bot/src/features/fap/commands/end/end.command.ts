import { DateTime } from 'luxon';

import { EndService } from './end.service';
import { Command } from '../../../../discord';
import { createContentOption } from '../../options';
import { getChannelEnv } from '../../../../utils';

export const end = new Command('end', 'End fapping')
  .addOption(createContentOption())
  .action(async context => {
    context.response.defer();

    const endService = new EndService(getChannelEnv(context.interaction.channelId));

    const { duration, content } = await endService.finishLastFap({
      ...context.options,
      endDate: DateTime.now(),
    });

    const contentMessage = content ? ` to ${content}` : ''
    await context.response.sendSuccess(`You finished fapping${contentMessage} after ${duration}`);
  });
