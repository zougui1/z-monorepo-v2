import { DateTime } from 'luxon';
import { MS } from '@zougui/common.ms';

import { StatsService } from './stats.service';
import { FapContentType } from '../../FapContentType';
import { Command } from '../../../../discord';
import { createContentOption } from '../../content.option';
import { getChannelEnv } from '../../../../utils';

export const stats = new Command('stats', 'Fapping statistics')
  .addOption(createContentOption())
  .action(async context => {
    context.response.defer();

    const statsService = new StatsService(getChannelEnv(context.interaction.channelId));
    const stats = await statsService.getStats({
      contents: context.options.content ? [context.options.content] : [],
    });

    const formattedStats = stats.map(stat => {
      const lines = [
        `- **${stat.content}** (since ${stat.startDate})`,
        `  - you have fapped \`${stat.count}\` time${stat.count > 1 ? 's' : ''}`,
        `  - you have wasted \`${stat.durations.total}\` of your life fapping`,
        `  - you fap for \`${stat.durations.average}\` in average`,
        `  - your shortest fap lasted \`${stat.durations.shortest}\``,
        `  - your longest fap lasted \`${stat.durations.longest}\``,
      ];
      return lines.join('\n');
    }).join('\n');

    await context.response.sendSuccess(`# Fap Stats\n\n${formattedStats}`);
  });
