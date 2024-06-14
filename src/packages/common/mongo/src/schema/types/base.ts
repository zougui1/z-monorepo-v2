import type zod from 'zod';

import type * as MongoDefaultStar from './default';
import type { MongoDefault } from './default';
import type * as MongoOptionalStar from './optional';
import type { MongoOptional } from './optional';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export abstract class MongoType<Type extends zod.ZodType = any, Def extends BaseMongoTypeDef<zod.infer<Type>> = BaseMongoTypeDef<zod.infer<Type>>> {
  readonly _schema!: Type;
  readonly _type!: Type['_type'];
  readonly _output!: Type['_output'];
  readonly _input!: Type['_input'];
  readonly _def: Def;
  abstract _bsonTypeName: `${BsonTypeName}`;

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

  default(defaultValue: zod.infer<Type> | (() => zod.infer<Type>)): MongoDefault<this> {
    const { MongoDefault } = require('./default') as typeof MongoDefaultStar;

    return MongoDefault.create({
      type: this,
      defaultValue,
    }) as MongoDefault<this>;
  }

  index(): MongoType<Type> {
    const Constructor = this.getConstructor();
    return new Constructor({
      ...this._def,
      index: true,
    });
  }

  unique(): MongoType<Type> {
    const Constructor = this.getConstructor();
    return new Constructor({
      ...this._def,
      index: true,
      unique: true,
    });
  }

  sparse(): MongoType<Type> {
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
