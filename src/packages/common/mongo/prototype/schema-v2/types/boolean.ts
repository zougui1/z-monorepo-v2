import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoBoolean extends MongoType<boolean, MongoBooleanDef> {
  readonly _bsonTypeName: `${BsonTypeName.Boolean}` = BsonTypeName.Boolean;
  /*readonly _operator!: {
    comparison: {
      '==': boolean;
      '!=': boolean;
      in: boolean[];
      nin: boolean[];
    };
  };*/

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
