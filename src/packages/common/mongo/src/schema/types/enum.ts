import zod from 'zod';

import type { EnumValues } from '@zougui/common.type-utils';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoEnum<Enum extends EnumValues<string>> extends MongoType<zod.ZodEnum<Enum>, MongoEnumDef<Enum>> {
  _bsonTypeName!: `${BsonTypeName.String}`;

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

export interface MongoEnumDef<Enum extends EnumValues<string>> extends BaseMongoTypeDef<zod.infer<zod.ZodEnum<Enum>>> {
  typeName: MongoTypeName.MongoEnum;
  enum: Enum;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  trim?: boolean;
  match?: RegExp;
  minLength?: number;
  maxLength?: number;
}
