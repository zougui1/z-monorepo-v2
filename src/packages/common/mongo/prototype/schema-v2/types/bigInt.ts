import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { BsonTypeName, MongoTypeName } from '../MongoTypeName';

export class MongoBigInt extends MongoType<bigint, MongoBigIntDef> {
  readonly _bsonTypeName: `${BsonTypeName.BigInt}` = BsonTypeName.BigInt;
  /*readonly _operator!: {
    comparison: {
      '==': bigint;
      '!=': bigint;
      '>': bigint;
      '>=': bigint;
      '<': bigint;
      '<=': bigint;
      in: bigint[];
      nin: bigint[];
    };
  };*/

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
