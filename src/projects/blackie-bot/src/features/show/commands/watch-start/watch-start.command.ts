import { nameOption, seasonsOption } from './options';
import { ShowService } from '../../show.service';
import { Command } from '../../../../discord';
import { getChannelEnv } from '../../../../utils';

export const watchStart = new Command('watch-start', 'Start watching a show')
  .addOption(nameOption)
  .addOption(seasonsOption)
  .action(async context => {
    await context.response.defer();

    const showService = new ShowService(getChannelEnv(context.interaction.channelId));
    const result = await showService.startWatching(context.options.name, context.options.seasons);

    await context.response.sendSuccess(result.message);
  });
