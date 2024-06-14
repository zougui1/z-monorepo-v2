import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoUndefined extends MongoType<zod.ZodUndefined, MongoUndefinedDef> {
  _bsonTypeName!: `${BsonTypeName.Null}`;

  static create(params?: Partial<Omit<MongoUndefinedDef, 'typeName'>>): MongoUndefined {
    return new MongoUndefined({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoUndefined,
    });
  }

  toZod(): zod.ZodUndefined {
    return zod.undefined();
  }
}

export interface MongoUndefinedDef extends BaseMongoTypeDef<undefined> {
  typeName: MongoTypeName.MongoUndefined;
}
