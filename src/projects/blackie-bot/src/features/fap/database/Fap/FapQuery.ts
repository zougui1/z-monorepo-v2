import { DateTime } from 'luxon';
import { Fap } from './Fap';
import { FapContentType } from '../../FapContentType';

export class FapQuery {
  readonly #model: Fap.Model;

  constructor(model: Fap.Model) {
    this.#model = model;
  }

  create = async (fap: Fap.Public): Promise<Fap.Object> => {
    const document = await this.#model.create(this.serialize(fap));
    return this.deserialize(document);
  }

  finish = async (id: string, options: FinishOptions): Promise<Fap.Object | undefined> => {
    const document = await this.#model.findByIdAndUpdate(id, options);
    return this.maybeDeserialize(document);
  }

  findUnfinishedFap = async (options?: FindUnfinishedFapOptions): Promise<Fap.Object | undefined> => {
    const messageIdFilter = options?.messageId && {
      messageId: options.messageId,
    };

    const fap = await this.#model.findOne({
      ...(messageIdFilter || {}),
      endDate: null,
    }).sort({ startDate: -1 });

    return this.maybeDeserialize(fap);
  }

  findByMessageId = async (messageId: string): Promise<Fap.Object | undefined> => {
    const fap = await this.#model.findOne({ messageId });
    return this.maybeDeserialize(fap);
  }

  updateByMessageId = async (messageId: string, fap: { content: FapContentType }): Promise<void> => {
    await this.#model.updateOne({ messageId }, fap);
  }

  deleteById = async (id: string): Promise<Fap.Object | undefined> => {
    const document = await this.#model.findByIdAndDelete(id);
    return this.maybeDeserialize(document);
  }

  findStats = async (options?: FindStatsOptions): Promise<FapStat[]> => {
    const contentFilter = options?.contents?.length && {
      content: {
        $in: options.contents,
      },
    };

    return await this.#model
      .aggregate()
      .match({
        endDate: {
          $ne: null,
        },
        ...(contentFilter || {})
      })
      .addFields({
        duration: {
          $dateDiff: {
            startDate: '$startDate',
            endDate: '$endDate',
            unit: 'millisecond'
          }
        }
      })
      .group({
        _id: '$content',
        faps: {
          $push: "$$ROOT"
        }
      })
      .project({
        _id: 0,
        content: '$_id',
        count: {
          $size: '$faps',
        },
        startDate: {
          $min: '$faps.startDate',
        },
        durations: {
          shortest: {
            $min: '$faps.duration'
          },
          longest: {
            $max: '$faps.duration'
          },
          total: {
            $sum: '$faps.duration'
          },
          average: {
            $avg: '$faps.duration'
          },
        },
      });
  }

  private deserialize = (document: Fap.Document): Fap.Object => {
    return {
      ...document.toObject(),
      _id: document._id.toString(),
      startDate: DateTime.fromJSDate(document.startDate),
      endDate: document.endDate ? DateTime.fromJSDate(document.endDate) : undefined,
    };
  }

  private maybeDeserialize = (document: Fap.Document | undefined | null): Fap.Object | undefined => {
    if(document) {
      return this.deserialize(document);
    }
  }

  private serialize = (document: Fap.Public): Fap => {
    return {
      ...document,
      startDate: document.startDate.toJSDate(),
      endDate: document.endDate?.toJSDate(),
    };
  }
}

export interface FindUnfinishedFapOptions {
  messageId?: string;
}

export interface FinishOptions {
  endDate: DateTime;
  content?: FapContentType;
}

export interface FindStatsOptions {
  contents?: FapContentType[];
}

export interface FapStat {
  content: FapContentType;
  count: number;
  startDate: Date;
  durations: {
    /**
     * milliseconds
     */
    shortest: number;
    /**
     * milliseconds
     */
    longest: number;
    /**
     * milliseconds
     */
    total: number;
    /**
     * milliseconds
     */
    average: number;
  };
}
