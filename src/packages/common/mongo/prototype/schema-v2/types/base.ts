import type zod from 'zod';

import type * as MongoDefaultStar from './default';
import type { MongoDefault } from './default';
import type * as MongoOptionalStar from './optional';
import type { MongoOptional } from './optional';
import { MongoTypeName, BsonTypeName, MongoComprisonOperator } from '../MongoTypeName';
import { ArrayItem } from '../../../types';

export abstract class MongoType<Output = any, Def extends BaseMongoTypeDef<Output> = BaseMongoTypeDef<Output>, Input = Output> {
  readonly _schema!: Output;
  readonly _type!: Output;
  readonly _output!: Output;
  readonly _input!: Input;
  readonly _def: Def;
  readonly abstract _bsonTypeName: `${BsonTypeName}`;
  /*readonly _operator!: {
    comparison: {
      '==': Output extends any[] ? never : Output;
      '!=': Output extends any[] ? never : Output;
      in: Flatten<Output[]>;
      nin: Flatten<Output[]>;
      all: Output extends any[] ? Output : any;
      size: Output extends any[] ? number : any;
      regex: Output extends string ? RegExp : any;
      //'>': Exclude<Output, (number | bigint | Date | null | undefined)> extends never ? NonNullable<Output> : never;
      //'>=': Exclude<Output, (number | bigint | Date | null | undefined)> extends never ? NonNullable<Output> : never;
      //'<': Exclude<Output, (number | bigint | Date | null | undefined)> extends never ? NonNullable<Output> : never;
      //'<=': Exclude<Output, (number | bigint | Date | null | undefined)> extends never ? NonNullable<Output> : never;
      //'>': Output extends (number | bigint | Date | null | undefined) ? NonNullable<Output> : never;
      //'>=': Output extends (number | bigint | Date | null | undefined) ? NonNullable<Output> : never;
      //'<': Output extends (number | bigint | Date | null | undefined) ? NonNullable<Output> : never;
      //'<=': Output extends (number | bigint | Date | null | undefined) ? NonNullable<Output> : never;
      //'>': NonNullable<Extract<Output, (number | bigint | Date)>>;
      //'>=': NonNullable<Extract<Output, (number | bigint | Date)>>;
      //'<': NonNullable<Extract<Output, (number | bigint | Date)>>;
      //'<=': NonNullable<Extract<Output, (number | bigint | Date)>>;
    } //extends infer O ? { [K in keyof O]: O[K] } : never;
  };*/

  constructor(def: Def) {
    this._def = def;
  }

  abstract toZod(): zod.ZodType;

  getConstructor(): any {
    return this.constructor;
  }

  optional(): MongoOptional<this> {
    const { MongoOptional } = require('./optional') as typeof MongoOptionalStar;
    return MongoOptional.create({ type: this });
  }

  default(defaultValue: Output | (() => Output)): MongoDefault<this> {
    const { MongoDefault } = require('./default') as typeof MongoDefaultStar;

    return MongoDefault.create({
      type: this,
      defaultValue,
    });
  }

  index(): MongoType<Output> {
    const Constructor = this.getConstructor();
    return new Constructor({
      ...this._def,
      index: true,
    });
  }

  unique(): MongoType<Output> {
    const Constructor = this.getConstructor();
    return new Constructor({
      ...this._def,
      index: true,
      unique: true,
    });
  }

  sparse(): MongoType<Output> {
    const Constructor = this.getConstructor();
    return new Constructor({
      ...this._def,
      sparse: true,
    });
  }
}

export interface BaseMongoTypeDef<T> {
  typeName: MongoTypeName;
  coerce: boolean;
  default?: () => T;
  required?: boolean;
  index?: boolean;
  unique?: boolean;
  sparse?: boolean;
}

type Flatten<T extends any[]> = (
  T extends Array<infer R>
  ? R extends any[]
  ? Flatten<R>[number]
  : R
  : []
)[];
