import mongoose from 'mongoose';
import { prop, getModelForClass, Severity } from '@typegoose/typegoose';

import { connections, type TypegooseDocument } from '../../../../../database';
import { InteractionType } from '../../../../../discord/InteractionType';


export class DiscordInteraction<T = unknown> {
  @prop({ required: true, index: true, unique: true })
  messageId!: string;

  @prop({ type: Date, required: true, default: () => new Date() })
  creationDate!: Date;

  @prop({ enum: InteractionType, required: true })
  type!: InteractionType;

  @prop({ required: true, index: true })
  interactionId!: string;

  @prop({ allowMixed: Severity.ALLOW, type: () => mongoose.Schema.Types.Mixed })
  data!: T;
}

export namespace DiscordInteraction {
  export const Prod = getModelForClass(DiscordInteraction, {
    existingConnection: connections.production,
    options: { disableCaching: true },
  });
  export const Test = getModelForClass(DiscordInteraction, {
    existingConnection: connections.development,
    options: { disableCaching: true },
  });

  export type Model = typeof Prod;
  export type Document = TypegooseDocument<DiscordInteraction>;
  export type Object<T = unknown> = DiscordInteraction<T> & { _id: string };
}
