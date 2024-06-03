import { nameOption } from './options';
import { ShowService } from '../../show.service';
import { Command } from '../../../../discord';
import { getChannelEnv } from '../../../../utils';

export const watchEnd = new Command('watch-end', 'Finish watching a show')
  .addOption(nameOption)
  .action(async context => {
    await context.response.defer();

    const showService = new ShowService(getChannelEnv(context.interaction.channelId));
    const result = await showService.endWatching(context.options.name);

    await context.response.sendSuccess(result.message);
  });
