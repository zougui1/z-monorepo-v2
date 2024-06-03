import { prop, getModelForClass } from '@typegoose/typegoose';

import { ShowSource } from '../../ShowSource';
import { connections, type TypegooseDocument } from '../../../../database';

export class Season {
  @prop({ required: true })
  index!: number;

  @prop({ required: true })
  episodeCount!: number;

  /**
   * duration in minutes
   */
  @prop({ required: true })
  duration!: number;
}

export class Show {
  @prop({ required: true, index: true, unique: true })
  name!: string;

  @prop({ enum: ShowSource, required: true })
  source!: ShowSource;

  @prop({ type: [Season], _id: false })
  seasons!: Season[];
}

export namespace Show {
  export const Prod = getModelForClass(Show, {
    existingConnection: connections.production,
    options: { disableCaching: true },
  });
  export const Dev = getModelForClass(Show, {
    existingConnection: connections.development,
    options: { disableCaching: true },
  });

  export type Model = typeof Prod;
  export type Document = TypegooseDocument<Show>;
  export type Object = Show & { _id: string };
}
