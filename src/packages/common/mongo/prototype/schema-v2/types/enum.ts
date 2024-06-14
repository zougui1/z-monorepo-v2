import zod from 'zod';

import type { EnumValues } from '@zougui/common.type-utils';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoEnum<Enum extends EnumValues<string>> extends MongoType<Enum[number], MongoEnumDef<Enum>> {
  readonly _bsonTypeName: `${BsonTypeName.String}` = BsonTypeName.String;
  /*readonly _operator!: {
    comparison: {
      '==': Enum[number];
      '!=': Enum[number];
      in: Enum[number][];
      nin: Enum[number][];
      regex: RegExp;
    };
  };*/

  static create<T extends EnumValues<string>>(values: T): MongoEnum<T> {
    return new MongoEnum({
      typeName: MongoTypeName.MongoEnum,
      coerce: false,
      enum: values,
    });
  }

  toZod(): zod.ZodEnum<Enum> {
    return zod.enum(this._def.enum);
  }
}

export interface MongoEnumDef<Enum extends EnumValues<string>> extends BaseMongoTypeDef<Enum[number]> {
  typeName: MongoTypeName.MongoEnum;
  enum: Enum;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  trim?: boolean;
  match?: RegExp;
  minLength?: number;
  maxLength?: number;
}
