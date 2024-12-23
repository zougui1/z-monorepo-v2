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
    return this.deserialize(document);
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
    return this.maybeDeserialize(document);
  }

  findByName = async (name: string): Promise<Show.Object | undefined> => {
    const document = await this.#model.findOne({ name });
    return this.maybeDeserialize(document);
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

    console.log(documents[0]?._id)
    return documents;
  }

  private deserialize = (document: Show.Document): Show.Object => {
    const documentObject = document.toObject();

    return {
      ...documentObject,
      _id: documentObject._id.toString(),
    };
  }

  private maybeDeserialize = (document: Show.Document | undefined | null): Show.Object | undefined => {
    if(document) {
      return this.deserialize(document);
    }
  }
}

export interface SearchOptions {
  name?: string;
  limit?: number;
  status?: WatchStatus;
}
