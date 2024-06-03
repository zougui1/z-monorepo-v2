import { tryit } from 'radash';
import { DateTime } from 'luxon';

import { MS } from '@zougui/common.ms';

import { WatchStatus } from './WatchStatus';
import { Show, Watch } from './database';
import { EnvType } from '../../EnvType';
import { getItemActionMessage } from '../../utils';

export class ShowService {
  protected readonly query: { show: Show.Query; watch: Watch.Query; };

  constructor(envType: EnvType) {
    this.query = {
      show: envType === EnvType.Production ? Show.Prod : Show.Dev,
      watch: envType === EnvType.Production ? Watch.Prod : Watch.Dev,
    };
  }

  searchShowNames = async (options?: SearchShowsByNameOptions): Promise<string[]> => {
    const [error, shows] = await tryit(this.query.show.search)(options);

    if (error) {
      throw new Error('An error occured while trying to retrieve unfinished show data', { cause: error });
    }

    return shows.map(show => show.name);
  }

  findOrCreateShow = async (data: Omit<Show.Object, '_id' | 'seasons'>): Promise<Show.Object> => {
    const [error, show] = await tryit(async () => {
      const show = await this.query.show.findByName(data.name);

      if (show) {
        return show;
      }

      return await this.query.show.create(data);
    })();

    if (error) {
      throw new Error(`An error occured while trying to retrieve data about the show ${data.name}`, { cause: error });
    }undefined

    return show;
  }

  addSeason = async (showName: string, data: AddSeasonData): Promise<void> => {
    await this.query.show.addSeason(showName, data);
  }

  getShowByName = async (name: string): Promise<Show.Object> => {
    const [error, show] = await tryit(this.query.show.findByName)(name);

    if (error) {
      throw new Error(`An error occured while trying to retrieve data about the show ${name}`, { cause: error });
    }

    if (!show) {
      throw new Error(`There is no show with name ${name}`);
    }

    return show;
  }

  startWatching = async (name: string, seasonIndexes: number[]): Promise<UpdateWatchResult> => {
    const show = await this.getShowByName(name);
    const unfinishedWatch = await this.query.watch.findOneByShowId(show._id, {
      status: WatchStatus.Watching,
    });

    if (unfinishedWatch) {
      throw new Error(`You are already watching the show ${name}`);
    }

    const missingSeasonIndexes = seasonIndexes.filter(seasonIndex => {
      return !show.seasons.some(season => season.index === seasonIndex);
    });

    if (missingSeasonIndexes.length) {
      throw new Error(`The show ${name} does not have the seasons: ${missingSeasonIndexes.join(', ')}`);
    }

    // the season indexes are optional, if none are provided
    // then take all the seasons available
    const ensuredSeasonIndexes = seasonIndexes.length
      ? seasonIndexes
      : show.seasons.map(season => season.index);

    await this.query.watch.create({
      show: {
        _id: show._id,
        source: show.source,
      },
      startDate: DateTime.now(),
      seasonIndexes: ensuredSeasonIndexes,
    });

    const message = getItemActionMessage({
      itemName: show.name,
      numbers: ensuredSeasonIndexes,
      actionLabel: 'You started watching',
      itemLabels: {
        singular: 'Season',
        plural: 'Seasons',
      },
    });

    return { message };
  }

  endWatching = async (name: string): Promise<UpdateWatchResult> => {
    const show = await this.getShowByName(name);
    const watch = await this.query.watch.findOneByShowId(show._id, {
      status: WatchStatus.Watching,
    });

    if (!watch) {
      throw new Error(`You did not start watching the show ${name}`);
    }

    const endDate = DateTime.now();

    await this.query.watch.updateById(watch._id, {
      endDate,
    });

    const message = getItemActionMessage({
      itemName: show.name,
      numbers: watch.seasonIndexes,
      actionLabel: 'You finished watching',
      itemLabels: {
        singular: 'Season',
        plural: 'Seasons',
      },
    });

    const startTimestamp = watch.startDate.toMillis();
    const endTimestamp = endDate.toMillis();
    const duration = MS.toString(endTimestamp - startTimestamp, { format: 'long' });

    return {
      message: `${message} after ${duration}`,
    };
  }

  getWatchStats = async (): Promise<GetWatchStatsResult> => {
    const stats = await this.query.watch.findStats();

    const watchingShows = stats.watchingShows.map(watchingShow => {
      const message = getItemActionMessage({
        itemName: watchingShow.name,
        numbers: watchingShow.seasonIndexes,
        itemLabels: {
          singular: 'Season',
          plural: 'Seasons',
        },
      });

      const startTime = MS.toString(Date.now() - watchingShow.startDate.toMillis(), { format: 'long' });

      return `- ${message} since ${startTime} ago`;
    });

    const totalWatchDuration = MS.toString(stats.totalWatchDuration * 60 * 1000, { format: 'verbose' });
    const currentlyWatchingShowsMessage = watchingShows.length > 0
      ? ['You are currently watching:', watchingShows.join('\n')]
      : ['You are not currently watching any shows'];

    return {
      message: [
        ...currentlyWatchingShowsMessage,
        '',
        `You have watched ${stats.watchedShowCount} different shows ${stats.totalWatchCount} times`,
        `You have wasted ${totalWatchDuration} of your life watching shows`,
      ].join('\n'),
    };
  }
}

export interface SearchShowsByNameOptions {
  name?: string;
  status?: WatchStatus;
}

export interface AddSeasonData {
  index: number;
  episodeCount: number;
  duration: number;
}

export interface UpdateWatchResult {
  message: string;
}

export interface GetWatchStatsResult {
  message: string;
}
