import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoBoolean extends MongoType<zod.ZodBoolean, MongoBooleanDef> {
  _bsonTypeName!: `${BsonTypeName.Boolean}`;

  static create(params?: Partial<Omit<MongoBooleanDef, 'typeName'>>): MongoBoolean {
    return new MongoBoolean({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoBoolean,
    });
  }

  toZod(): zod.ZodBoolean {
    return this._def.coerce ? zod.coerce.boolean() : zod.boolean();
  }
}

export interface MongoBooleanDef extends BaseMongoTypeDef<boolean> {
  typeName: MongoTypeName.MongoBoolean;
}
