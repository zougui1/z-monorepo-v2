import { prop, buildSchema } from '@typegoose/typegoose';

import { TextAlign } from './enums';
import { enumProp } from '../../utils';
import { WeakEnum } from '../../../types';

export class DescriptionNode {
  @prop({ required: true })
  type!: string;

  @enumProp({ enum: TextAlign })
  textAlign?: WeakEnum<TextAlign> | undefined;

  @prop({ default: '' })
  text!: string;

  @prop({ type: String })
  href?: string | undefined;

  @prop({ type: String })
  src?: string | undefined;

  @prop({ type: String })
  alt?: string | undefined;

  @prop({ type: String })
  title?: string | undefined;

  @prop({ type: String })
  style?: string | undefined;

  children?: DescriptionNode[] | undefined;
}

// istanbul ignore next for some reason the namespace is marked as untested
export namespace DescriptionNode {
  export const Schema = buildSchema(DescriptionNode);
  Schema.add({ children: [{ type: Schema, _id: false }] });
}
