import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoArray<T extends MongoType> extends MongoType<T['_output'][], MongoArrayDef<T>> {
  readonly _bsonTypeName: `${BsonTypeName.Array}` = BsonTypeName.Array;
  /*readonly _operator!: {
    comparison: {
      in: T['_output'][][];
      nin: T['_output'][][];
      all: T['_output'][][];
      size: number;
    };
  };*/

  static create<T extends MongoType>(items: T): MongoArray<T> {
    return new MongoArray({
      typeName: MongoTypeName.MongoArray,
      coerce: false,
      items,
    });
  }

  toZod(): zod.ZodArray<T['_schema']> {
    return zod.array(this._def.items.toZod());
  }
}

export interface MongoArrayDef<T extends MongoType> extends BaseMongoTypeDef<T['_output'][]> {
  typeName: MongoTypeName.MongoArray;
  items: T;
}
