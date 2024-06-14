import type { AnyObject, EnumValues } from '@zougui/common.type-utils';

import { AndBranchBuilder } from './AndBranchBuilder';
import { OrBranchBuilder } from './OrBranchBuilder';
import type { InferBranchSchema } from './BaseBranchBuilder';
import type {
  MongoObject,
  MongoRawShape,
  MongoInfer,
  FindMongoObject,
  MongoOptional,
  MongoType,
  MongoString,
  MongoNumber,
  MongoBoolean,
  MongoBigInt,
  MongoDate,
  MongoArray,
  MongoUnion,
  MongoNull,
  MongoUndefined,
  MongoDefault,
  MongoEnum,
  MongoObjectId,
} from '../schema-v2';
import type { MaskPick, ArrayItem, MaskOmit, MergeMongoDifferences } from '../types';
import { mandatoryDocumentSchema, type MandatoryDocumentSchema, type Model } from '../model';

export class QueryBuilder<
  M extends Model<MongoObject> = Model<MongoObject>,
  Shape extends object = object,
  IsDocument extends boolean = false,
  Reverse extends boolean = false,
> {
  readonly _shape!: Shape;
  readonly model: M;
  readonly schema: MongoObject;
  readonly isDocument: IsDocument;
  readonly reverse: Reverse;

  constructor(model: M, schema: MongoObject, isDocument: IsDocument, reverse: Reverse) {
    this.model = model;
    this.schema = schema;
    this.isDocument = isDocument;
    this.reverse = reverse;
  }

  private getPreservedMandatoryDocumentProperties(): (keyof MandatoryDocumentSchema['_shape'])[] {
    if (!this.isDocument) {
      return [];
    }

    const mandatoryProperties = Object.keys(mandatoryDocumentSchema._def.shape) as (keyof MandatoryDocumentSchema['_shape'])[];
    return mandatoryProperties.filter(property => property in this.schema._def.shape);
  }

  /**
   * used for debugging purposes
   */
  peekSchema(peek: (schema: Model<MongoObject>) => void): this {
    peek(this.schema);
    return this;
  }

  select<T extends keyof Shape>(keys: T[]): QueryBuilder<M, Select<Shape, T, IsDocument>, IsDocument, Reverse> {
    const newSchema = this.schema.select([...keys, ...this.getPreservedMandatoryDocumentProperties()] as string[]);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse);
  }

  unselect<T extends keyof Shape>(keys: T[]): QueryBuilder<M, Omit<Shape, T>, IsDocument> {
    const newSchema = this.schema.unselect(keys as string[]);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse) as any;
  }

  pick<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, ProcessMask<Shape, Mask, IsDocument>, IsDocument, Reverse> {
    const presedMandatoryMask = this
      .getPreservedMandatoryDocumentProperties()
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});

    const newSchema = this.schema.pick({
      ...presedMandatoryMask,
      ...mask,
    });
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse);
  }

  omit<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MaskOmit<Shape, Mask>, IsDocument, Reverse> {
    const newSchema = this.schema.omit(mask);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse);
  }

  //where<Key extends keyof Shape>(key: Key, operator: TypedComparisonOperator<MongoInfer<Shape[Key]>>, value: MongoInfer<Shape[Key]>): QueryBuilder<M, Model<MongoObject>, IsDocument> {
  where<Key extends keyof Shape, Operator extends TypedComparisonOperator<Shape[Key]>>(
    key: Key,
    operator: Operator,
    value: ExpectedOperationType<Shape[Key], Operator>,
  ): QueryBuilder<M, Shape, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse);
  }

  whereNotNull<Key extends keyof Shape>(key: Key): QueryBuilder<M, MongoSetRequiredKey<Shape, Key & string, Reverse>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema as any, this.isDocument, this.reverse);
  }

  sub<
    Key extends SubObjectKeys<Shape>,
    SubQuery extends QueryBuilder<M, object>,
    >(
      key: Key,
      subQuery: (subQuery: QueryBuilder<M, NonNullable<Shape[Key]>>) => SubQuery,
    ): QueryBuilder<M, MergeValueIntoObject<Shape, Key & string, (undefined | null) extends Shape[Key] ? SubQuery['_shape'] | null | undefined : SubQuery['_shape']>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse) as any;
  }

  whereType<
    Key extends keyof Shape,
    Type extends keyof MongoTypeMap,
  >(
    key: Key,
    type: Type,
  ): QueryBuilder<M, MongoSetKeyType<Shape, Key & string, Type, Reverse>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse) as any;
  }

  not<
    SubQuery extends QueryBuilder<M, object, IsDocument, Reverse extends true ? false : true>,
  >(
    subQuery: (subQuery: QueryBuilder<M, NonNullable<Shape>, IsDocument, Reverse extends true ? false : true>) => SubQuery,
  ): QueryBuilder<M, SubQuery['_shape'], IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, !this.reverse) as any;
  }

  whereOr<SubQueries extends ((subQuery: QueryBuilder<M, Shape>) => QueryBuilder<M, object>)[]>(
    ...subQueries: SubQueries
  ): QueryBuilder<M, ReturnType<SubQueries[number]>['_shape'], IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse);
  }

  whereOr2<Branch extends OrBranchBuilder<M, object, any>>(
    buildBranch: (builder: AndBranchBuilder<M, Shape>) => Branch
  ): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse);
  }

  whereAnd<
    Branch extends AndBranchBuilder<M, MongoObject<MongoRawShape>, any>
  >(buildBranch: (builder: AndBranchBuilder<M, Shape>) => Branch): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse) as any;
  }

  async find(): Promise<Shape[]> {
    const shape = 'shape' in this.schema._def
      ? this.schema._def.shape
      : {};

    const projection = Object.keys(shape).reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, {} as Record<string, 1>);

    return await this.model.model.find(
      {},
      projection,
    );
  }
}

type ComparisonOperator = ArithmeticComparisonOperator | ArrayComparisonOperator;
type ArithmeticComparisonOperator = CommonComparisonOperator | '>' | '<' | '>=' | '<=';
type CommonComparisonOperator = '==' | '!=' | 'in' | 'nin';
type ArrayComparisonOperator = 'in' | 'nin' | 'all' | 'size';
type StringComparisonOperator = CommonComparisonOperator | 'regex';
type AnyComparisonOperator = ArithmeticComparisonOperator | ArrayComparisonOperator | StringComparisonOperator;

type TypedComparisonOperator<T> = (
  T extends number
  ? ArithmeticComparisonOperator
  : T extends BigInt
  ? ArithmeticComparisonOperator
  : T extends Date
  ? ArithmeticComparisonOperator
  : T extends any[]
  ? ArrayComparisonOperator
  : T extends string
  ? StringComparisonOperator
  : CommonComparisonOperator
);

export type ExpectedOperationType<
  T,
  Operator extends AnyComparisonOperator,
> = (
  // fixes type 'never' for unions including string types
  Operator extends 'regex'
  ? RegExp
  : OperationTypeMap<T> extends { [K in InferTypeName<T>]: any }
  ? OperationTypeMap<T>[InferTypeName<T>] extends { [K in Operator]: any }
  ? OperationTypeMap<T>[InferTypeName<T>][Operator]
  : never
  : never
);

export type OperationTypeMap<T> = {
  string: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
    regex: RegExp;
  };
  number: {
    '==': T;
    '!=': T;
    '>': number;
    '>=': number;
    '<': number;
    '<=': number;
    in: T[];
    nin: T[];
  };
  bigInt: {
    '==': T;
    '!=': T;
    '>': BigInt;
    '>=': BigInt;
    '<': BigInt;
    '<=': BigInt;
    in: T[];
    nin: T[];
  };
  date: {
    '==': T;
    '!=': T;
    '>': Date;
    '>=': Date;
    '<': Date;
    '<=': Date;
    in: T[];
    nin: T[];
  };
  array: {
    in: T;
    nin: T;
    all: T;
    size: number;
  };
  boolean: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
  };
  object: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
  };
  null: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
  };
};

//type PrimitiveType = string | number |

// NonNullable because for some reason `undefined` is added to the resulting type
export type SubObjectKeys<T extends object> = NonNullable<{
  [Key in keyof T]: IsObject<T[Key]> extends true ? Key : never;
}[keyof T]>;

type IsObject<T> = (
  NonNullable<T> extends AnyObject[]
  ? true
  : Extract<Exclude<NonNullable<T>, Date | any[]>, AnyObject> extends never
  ? false
  : Extract<Exclude<NonNullable<T>, Date | any[]>, AnyObject> extends AnyObject
  ? true
  : false
);

export type MergeValueIntoObject<T extends AnyObject, Key extends string, Value> = ({
  [K in RequiredKeys<Omit<T, Key> & { [Kkey in Key]: Value; }> & string]: MergedProperty<T[K], K, Key, Value>;
} & {
  [K in OptionalKeys<Omit<T, Key> & { [Kkey in Key]: Value; }> & string]?: MergedProperty<T[K], K, Key, Value>;
}) extends infer O ? { [K in keyof O]: O[K] } : never;

type MergedProperty<P, TK extends string, Key extends string, Value> = TK extends Key ? Value : P;

export type MongoTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  bigint: bigint;
  date: Date;
  object: object;
  array: any[];
  null: null;
};

type InferTypeName<T> = (
  T extends string
  ? 'string'
  : T extends bigint
  ? 'bigInt'
  : T extends boolean
  ? 'boolean'
  : T extends Date
  ? 'date'
  : T extends number
  ? 'number'
  : T extends any[]
  ? 'array'
  : T extends (null | undefined)
  ? 'null'
  : T extends object
  ? 'object'
  : never
);

type ExtractMongoType<T, TypeName extends keyof MongoTypeMap> = (
  ReapplyExpectedNull<NonNullable<T> & MongoTypeMap[TypeName], TypeName>
);

type ExcludeMongoType<T, TypeName extends keyof MongoTypeMap> = (
  ReapplyExpectedNull<
    Exclude<NonNullable<T>, MongoTypeMap[TypeName]> extends never
      ? (null | undefined)
      : Exclude<NonNullable<T>, MongoTypeMap[TypeName]>,
    TypeName
  >
);

export type ReapplyExpectedNull<T, TypeName extends keyof MongoTypeMap> = (
  TypeName extends 'null'
  ? null
  : T
);

export type PreserveMandatoryDocumentProperties<T extends object, IsDocument extends boolean> = (
  IsDocument extends true
  ? T extends MongoInfer<MandatoryDocumentSchema>
  ? (keyof MandatoryDocumentSchema['_shape'] & string)
  : never
  : never
);

export type PickToMask<T extends string> = {
  [K in T]: true;
} extends infer O ? { [K in keyof O]: O[K] } : never;

export type ProcessMask<
  Shape extends object,
  Mask extends Partial<Record<keyof Shape, boolean>>,
  IsDocument extends boolean,
> = (
  MaskPick<
    Shape,
    (
      Mask &
      PickToMask<Exclude<PreserveMandatoryDocumentProperties<Shape, IsDocument> & string, keyof Mask> & string>
    )
  > extends infer O ? { [K in keyof O]: O[K] } : never
);

type MongoSetRequiredKey<
  Shape extends object,
  Key extends keyof Shape,
  Reverse extends boolean,
> = MergeValueIntoObject<Shape, Key & string, Reverse extends true ? (null | undefined) : Exclude<Shape[Key], null | undefined>>;

type MongoSetKeyType<
  Shape extends object,
  Key extends keyof Shape,
  Type extends keyof MongoTypeMap,
  Reverse extends boolean,
> = MergeValueIntoObject<Shape, Key & string, Reverse extends true ? ExcludeMongoType<Shape[Key], Type> : ExtractMongoType<Shape[Key], Type>>;

type RequiredKeys<T extends object> = NonNullable<{
  [Key in keyof T]: (undefined | null) extends T[Key] ? never : Key;
}[keyof T]>;
type OptionalKeys<T extends object> = NonNullable<{
  [Key in keyof T]: (undefined | null) extends T[Key] ? Key : never;
}[keyof T]>;

type Select<
  Shape extends object,
  Key extends keyof Shape,
  IsDocument extends boolean,
  PreservedKey = PreserveMandatoryDocumentProperties<Shape, IsDocument>,
> = ({
  [K in (Extract<RequiredKeys<Shape>, Key> & string) | (PreservedKey & string)]: Shape[K];
} & {
  [K in Extract<OptionalKeys<Shape>, Key>]?: Shape[K];
}) extends infer O ? { [K in keyof O]: O[K] } : never;
