import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoNull extends MongoType<zod.ZodNull, MongoNullDef> {
  _bsonTypeName!: `${BsonTypeName.Null}`;

  static create(params?: Partial<Omit<MongoNullDef, 'typeName'>>): MongoNull {
    return new MongoNull({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoNull,
    });
  }

  toZod(): zod.ZodNull {
    return zod.null();
  }
}

export interface MongoNullDef extends BaseMongoTypeDef<null> {
  typeName: MongoTypeName.MongoNull;
}
