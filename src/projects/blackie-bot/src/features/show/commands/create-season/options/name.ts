import { z } from 'zod';

import { ShowService } from '../../../show.service';
import { Option } from '../../../../../discord';
import { getChannelEnv } from '../../../../../utils';

export const nameOption = new Option('name', 'Name of the show', z.string())
  .autocomplete(async context => {
    const showService = new ShowService(getChannelEnv(context.interaction.channelId));
    return await showService.searchShowNames({ name: context.value });
  });
