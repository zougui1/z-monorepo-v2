import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoUndefined extends MongoType<undefined, MongoUndefinedDef> {
  readonly _bsonTypeName: `${BsonTypeName.Null}` = BsonTypeName.Null;
  /*readonly _operator!: {
    comparison: {
      '==': null;
      '!=': null;
      in: null[];
      nin: null[];
    };
  };*/

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
