import { prop, getModelForClass } from '@typegoose/typegoose';

import { enumProp } from '../../utils';
import { DocumentType } from '../../types';
import { Source } from '../../../enums';
import { WeakEnum } from '../../../types';

export class User {
  @prop({ required: true, index: true })
  id!: string;

  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true })
  profileUrl!: string;

  @prop({ required: true, type: String })
  avatarUrl?: string | undefined;

  @enumProp({ enum: Source })
  source!: WeakEnum<Source>;
}

// istanbul ignore next for some reason the namespace is marked as untested
export namespace User {
  export const Model = getModelForClass(User);
  export type Document = DocumentType<User>;
  export type Object = User & { _id: string };
}
