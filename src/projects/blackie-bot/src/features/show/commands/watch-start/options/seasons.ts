import zod from 'zod';

import { ShowService } from '../../../show.service';
import { findUnitsSuggestions, getChannelEnv } from '../../../../../utils';
import { Option } from '../../../../../discord';
import { parseListableNumber } from '../../../../../utils';

export const seasonsOption = new Option(
  'seasons',
  'Choose the seasons you are going to watch',
  zod.string().optional().transform(arg => arg ? parseListableNumber(arg, { strict: true }) : [])
)
  .autocomplete(async context => {
    const showName = context.interaction.options.getString('name', true);
    const service = new ShowService(getChannelEnv(context.interaction.channelId));
    const show = await service.getShowByName(showName);

    return findUnitsSuggestions(show.seasons, {
      search: context.value,
      seriesName: showName,
      label: {
        singular: 'Season',
        plural: 'Seasons',
      },
      getUnitNumber: season => season.index,
      getUnitName: season => showName,
    });
  });
