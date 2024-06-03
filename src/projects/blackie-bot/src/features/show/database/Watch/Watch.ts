import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import type { DateTime } from 'luxon';

import { ShowSource } from '../../ShowSource';
import { connections, type TypegooseDocument } from '../../../../database';
import { Show } from '../Show';
import mongoose from 'mongoose';

export class WatchShow {
  @prop({ required: true, ref: () => Show.Model, index: true })
  _id!: mongoose.Types.ObjectId;

  @prop({ enum: ShowSource, required: true })
  source!: ShowSource;
}

export class Watch {
  @prop({ required: true, type: WatchShow })
  show!: WatchShow;

  /**
   * indexes of the seasons watched
   */
  @prop({ type: [Number] })
  seasonIndexes!: number[];

  @prop({ type: Date, required: true })
  startDate!: Date;

  @prop({ type: Date, required: false })
  endDate?: Date;
}

export namespace Watch {
  export const Prod = getModelForClass(Watch, {
    existingConnection: connections.production,
    options: { disableCaching: true },
  });
  export const Dev = getModelForClass(Watch, {
    existingConnection: connections.development,
    options: { disableCaching: true },
  });

  export type Model = typeof Prod;
  export type Document = TypegooseDocument<Watch>;
  export type Object = Public & { _id: string };

  export interface Public extends Omit<Watch, 'startDate' | 'endDate' | 'show'> {
    show: Omit<WatchShow, '_id'> & {
      _id: string;
    };
    startDate: DateTime;
    endDate?: DateTime;
  }
}
