import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';

export class MongoUnion<
  T extends MongoUnionOptions = [MongoType, MongoType, ...MongoType[]],
  Output extends T[number]['_output'] = T[number]['_output'],
> extends MongoType<Output, MongoUnionDef<T>> {
  readonly _bsonTypeName!: T[number]['_bsonTypeName'];
  //readonly _operator!: T extends T ? T[number]['_operator'] : never;
  /*readonly _operator!: {
    comparison: {
      '==': Output;
      '!=': Output;
      in: Output[];
      nin: Output[];
      all: Output extends any[] ? Output[] : never;
      size: Output extends any[] ? number : never;
      regex: Output extends string ? RegExp : never;
      '>': Output extends (number | bigint | Date) ? Output : never;
      '>=': Output extends (number | bigint | Date) ? Output : never;
      '<': Output extends (number | bigint | Date) ? Output : never;
      '<=': Output extends (number | bigint | Date) ? Output : never;
    } extends infer O ? { [K in keyof O]: O[K] } : never;
  };*/

  static create<T extends MongoUnionOptions = [MongoType, MongoType, ...MongoType[]]>(options: T): MongoUnion<T> {
    return new MongoUnion({
      typeName: MongoTypeName.MongoUnion,
      coerce: false,
      options,
    });
  }

  toZod(): zod.ZodUnion<[T[number]['_schema'], T[number]['_schema']]> {
    const options = this._def.options.map(option => option.toZod());
    return zod.union<[zod.ZodType, zod.ZodType]>(options as [zod.ZodType, zod.ZodType]);
  }
}

export type MongoUnionOptions = Readonly<[MongoType, ...MongoType[]]>;

export interface MongoUnionDef<T extends MongoUnionOptions = [MongoType, MongoType, ...MongoType[]]> extends BaseMongoTypeDef<T[number]['_output']> {
  typeName: MongoTypeName.MongoUnion;
  options: T;
}
