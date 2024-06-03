import { DateTime } from 'luxon';

import { Watch, WatchShow } from './Watch';
import { WatchStatus } from '../../WatchStatus';
import { ShowSource } from '../../ShowSource';

export class WatchQuery {
  readonly #model: Watch.Model;

  constructor(model: Watch.Model) {
    this.#model = model;
  }

  create = async (watch: Watch.Public): Promise<Watch.Object> => {
    const document = await this.#model.create(this.serialize(watch));
    return this.deserialize(document);
  }

  findOneByShowId = async (showId: string, options?: FindOneByShowIdOptions): Promise<Watch.Object | undefined> => {
    const watchingFilter = options?.status === WatchStatus.Watching && {
      endDate: null,
    };
    const watchedFilter = options?.status === WatchStatus.NotWatching && {
      endDate: { $ne: null },
    };

    const document = await this.#model.findOne({
      ...(watchingFilter || {}),
      ...(watchedFilter || {}),
      'show._id': showId,
    });

    return this.maybeDeserialize(document);
  }

  updateById = async (watchId: string, data: Partial<Watch.Public>): Promise<void> => {
    await this.#model.findByIdAndUpdate(watchId, data);
  }

  findStats = async (): Promise<WatchStatsResult> => {
    const [stats] = await this.#model
      .aggregate<WatchStatsResult>()
      .lookup({
        from: 'shows',
        localField: 'show._id',
        foreignField: '_id',
        as: 'show',
      })
      .addFields({
        show: {
          $first: '$show'
        }
      })
      .facet({
        watchingShows: [
          {
            $match: {
              endDate: null,
            },
          },
        ],
        watched: [
          {
            $match: {
              endDate: {
                $ne: null,
              },
            },
          },
          {
            $addFields: {
              duration: {
                $sum: {
                  $map: {
                    input: "$seasonIndexes",
                    as: "seasonIndex",
                    in: {
                      $getField: {
                        input: {
                          $first: {
                            $filter: {
                              input: "$show.seasons",
                              as: "showSeason",
                              cond: {
                                $eq: [
                                  "$$showSeason.index",
                                  "$$seasonIndex",
                                ],
                              },
                            },
                          },
                        },

                        field: "duration",
                      },
                    },
                  },
                },
              },
            }
          },
          {
            $group: {
              _id: '$show._id',
              duration: {
                $sum: '$duration',
              },
            },
          },
        ],
        watchCount: [
          {
            $match: {
              endDate: {
                $ne: null,
              },
            },
          },
          {
            $group: {
              _id: "$show._id",
              show: {
                $first: "$show",
              },
              seasonIndexes: {
                $push: '$seasonIndexes'
              }
            }
          },
          // flattens the arrays of season indexes
          {
            $addFields: {
              seasonIndexes: {
                $reduce: {
                  input: "$seasonIndexes",
                  initialValue: [],
                  in: {
                    $concatArrays: ["$$value", "$$this"],
                  },
                },
              },
            }
          },
          {
            $unwind: {
              path: '$seasonIndexes',
            }
          },
          {
            $group: {
              _id: {
                showId: "$show._id",
                season: "$seasonIndexes",
              },
              count: {
                $sum: 1,
              },
            }
          },
          {
            $group: {
              _id: "$_id.showId",
              minCount: {
                $min: "$count",
              },
              season: {
                $push: {
                  season: "$_id.season",
                  count: "$count",
                },
              },
            }
          },
          {
            $project: {
              _id: 1,
              minCount: 1,
              seasonsWithMinCount: {
                $filter: {
                  input: "$season",
                  as: "s",
                  cond: {
                    $eq: ["$$s.count", "$minCount"],
                  },
                },
              },
            }
          },
          {
            $group: {
              _id: null,
              value: {
                $sum: "$minCount",
              },
            }
          }
        ]
      })
      .project({
        watchingShows: {
          $map: {
            input: '$watchingShows',
            as: 'watchingShow',
            in: {
              _id: '$$watchingShow.show._id',
              name: '$$watchingShow.show.name',
              source: '$$watchingShow.show.source',
              seasonIndexes: '$$watchingShow.seasonIndexes',
              startDate: '$$watchingShow.startDate',
            }
          }
        },
        totalWatchDuration: {
          $sum: "$watched.duration",
        },
        watchedShowCount: {
          $size: '$watched',
        },
        totalWatchCount: {
          $first: '$watchCount.value'
        }
      });

    if (stats) {
      return {
        ...stats,
        watchingShows: stats.watchingShows.map((watchingShow: any) => {
          console.log(watchingShow.startDate)
          return {
            ...watchingShow,
            startDate: DateTime.fromJSDate(watchingShow.startDate),
          };
        }),
      };
    }

    return {
      watchingShows: [],
      totalWatchDuration: 0,
      totalWatchCount: 0,
      watchedShowCount: 0,
    };
  }

  private deserialize = (document: Watch.Document): Watch.Object => {
    const documentObject = document.toObject();

    return {
      ...documentObject,
      _id: documentObject._id.toString(),
      show: {
        ...documentObject.show,
        _id: documentObject.show._id.toString(),
      },
      startDate: DateTime.fromJSDate(document.startDate),
      endDate: document.endDate ? DateTime.fromJSDate(document.endDate) : undefined,
    };
  }

  private maybeDeserialize = (document: Watch.Document | undefined | null): Watch.Object | undefined => {
    if(document) {
      return this.deserialize(document);
    }
  }

  private serialize = (document: Watch.Public): Watch => {
    return {
      ...document,
      startDate: document.startDate.toJSDate(),
      endDate: document.endDate?.toJSDate(),
      show: document.show as unknown as WatchShow,
    };
  }
}

export interface WatchStatsResult {
  watchingShows: {
    _id: string;
    name: string;
    source: ShowSource;
    seasonIndexes: number[];
    startDate: DateTime;
  }[];

  /**
   * in minutes
   */
  totalWatchDuration: number;
  totalWatchCount: number;
  watchedShowCount: number;
}

export interface SearchByNameOptions {
  limit?: number;
}

export interface FindOneByShowIdOptions {
  status?: WatchStatus;
}
