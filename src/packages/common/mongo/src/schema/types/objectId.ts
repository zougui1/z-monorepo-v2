import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoObjectId extends MongoType<zod.ZodString, MongoObjectIdDef> {
  _bsonTypeName!: `${BsonTypeName.String}`;

  static create(params?: Partial<Omit<MongoObjectIdDef, 'typeName'>>): MongoObjectId {
    return new MongoObjectId({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoObjectId,
    });
  }

  toZod(): zod.ZodString {
    return zod.string();
  }
}

export interface MongoObjectIdDef extends BaseMongoTypeDef<string> {
  typeName: MongoTypeName.MongoObjectId;
}
