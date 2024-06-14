import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoBigInt extends MongoType<zod.ZodBigInt, MongoBigIntDef> {
  _bsonTypeName!: `${BsonTypeName.BigInt}`;

  static create(params?: Partial<Omit<MongoBigIntDef, 'typeName'>>): MongoBigInt {
    return new MongoBigInt({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoBigInt,
    });
  }

  toZod(): zod.ZodBigInt {
    return this._def.coerce ? zod.coerce.bigint() : zod.bigint();
  }
}

export interface MongoBigIntDef extends BaseMongoTypeDef<bigint> {
  typeName: MongoTypeName.MongoBigInt;
}
