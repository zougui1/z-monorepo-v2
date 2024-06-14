import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoNull extends MongoType<null, MongoNullDef> {
  readonly _bsonTypeName: `${BsonTypeName.Null}` = BsonTypeName.Null;
  /*readonly _operator!: {
    comparison: {
      '==': null;
      '!=': null;
      in: null[];
      nin: null[];
    };
  };*/

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
