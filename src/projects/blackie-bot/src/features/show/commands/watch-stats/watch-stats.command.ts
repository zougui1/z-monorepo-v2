import { ShowService } from '../../show.service';
import { Command } from '../../../../discord';
import { getChannelEnv } from '../../../../utils';

export const watchStats = new Command('watch-stats', 'Get watching statistics')
  .action(async context => {
    await context.response.defer();

    const showService = new ShowService(getChannelEnv(context.interaction.channelId));
    const result = await showService.getWatchStats();

    await context.response.sendSuccess(result.message);
  });
