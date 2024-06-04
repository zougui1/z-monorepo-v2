import { prop, getModelForClass } from '@typegoose/typegoose';
import type { DateTime } from 'luxon';

import { FapContentType } from '../../FapContentType';
import { connections, type TypegooseDocument } from '../../../../database';

export class Fap {
  @prop({ enum: FapContentType, type: String, required: true })
  content!: FapContentType;
  /*
  * custom schema type prototype
  @prop({ type: LuxonDateTime, required: true })
  startDate!: DateTime;

  @prop({ type: LuxonDateTime, required: false })
  endDate?: DateTime;*/

  @prop({ type: Date, required: true })
  startDate!: Date;

  @prop({ type: Date, required: false })
  endDate?: Date;

  @prop({ type: String, required: false, index: true })
  messageId?: string;
}

export namespace Fap {
  export const Prod = getModelForClass(Fap, {
    existingConnection: connections.production,
    options: { disableCaching: true },
  });
  export const Dev = getModelForClass(Fap, {
    existingConnection: connections.development,
    options: { disableCaching: true },
  });

  export type Model = typeof Prod;
  export type Document = TypegooseDocument<Fap>;
  export type Object = Public & { _id: string };

  export interface Public extends Omit<Fap, 'startDate' | 'endDate'> {
    startDate: DateTime;
    endDate?: DateTime;
  }
}
