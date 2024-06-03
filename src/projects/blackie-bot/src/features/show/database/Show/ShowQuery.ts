import escapeRegex from 'escape-string-regexp';
import type { SetOptional } from 'type-fest';

import { Show, Season } from './Show';
import { WatchStatus } from '../../WatchStatus';

const DEFAULT_LIMIT = 25;

export class ShowQuery {
  readonly #model: Show.Model;

  constructor(model: Show.Model) {
    this.#model = model;
  }

  create = async (show: SetOptional<Show, 'seasons'>): Promise<Show.Object> => {
    const document = await this.#model.create(show);
    return document.toObject();
  }

  addSeason = async (showName: string, season: Season): Promise<void> => {
    await this.#model.updateOne({ name: showName }, {
      $push: {
        seasons: season,
      },
    });
  }

  findById = async (showId: string): Promise<Show.Object | undefined> => {
    const document = await this.#model.findById(showId);
    return document?.toObject();
  }

  findByName = async (name: string): Promise<Show.Object | undefined> => {
    const document = await this.#model.findOne({ name });
    return document?.toObject();
  }

  search = async (options?: SearchOptions): Promise<Show.Object[]> => {
    const nameFilter = options?.name && {
      name: {
        $regex: new RegExp(escapeRegex(options.name), 'i'),
      },
    };
    const watchingFilter = options?.status === WatchStatus.Watching && {
      'watches.endDate': null,
    };
    const notWatchingFilter = options?.status === WatchStatus.NotWatching && {
      'watches.endDate': { $ne: null },
    };

    const documents = await this.#model
      .aggregate()
      .match(nameFilter || {})
      .lookup({
        from: 'watches',
        localField: '_id',
        foreignField: 'show._id',
        as: 'watches',
        pipeline: [
          { $limit: 1 },
        ],
      })
      .match({
        ...(watchingFilter || {}),
        ...(notWatchingFilter || {}),
      })
      .sort({ name: 1 })
      .limit(options?.limit ?? DEFAULT_LIMIT)
      .project({
        name: 1,
        source: 1,
        seasons: 1,
      });

    return documents;
  }
}

export interface SearchOptions {
  name?: string;
  limit?: number;
  status?: WatchStatus;
}
