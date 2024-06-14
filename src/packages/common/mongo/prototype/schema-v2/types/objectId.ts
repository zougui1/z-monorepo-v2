import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoObjectId extends MongoType<string, MongoObjectIdDef> {
  readonly _bsonTypeName: `${BsonTypeName.String}` = BsonTypeName.String;
  /*readonly _operator!: {
    comparison: {
      '==': string;
      '!=': string;
      in: string[];
      nin: string[];
      regex: RegExp;
    };
  };*/

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
