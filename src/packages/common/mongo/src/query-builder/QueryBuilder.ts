import type { Merge } from 'type-fest';

import type { AnyObject, EnumValues } from '@zougui/common.type-utils';

import { AndBranchBuilder } from './AndBranchBuilder';
import { OrBranchBuilder } from './OrBranchBuilder';
import type { InferBranchSchema } from './BaseBranchBuilder';
import {
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
} from '../schema';
import type { MaskPick, MaskOmit } from '../types';
import { mandatoryDocumentSchema, type MandatoryDocumentSchema, type Model } from '../model';

export class QueryBuilder<
  M extends Model<MongoObject<MongoRawShape>>,
  Schema extends MongoObject<MongoRawShape>,
  IsDocument extends boolean = false,
  IsReverse extends boolean = false,
  Shape extends Schema['_shape'] = Schema['_shape'],
> {
  readonly model: M;
  readonly schema: Schema;
  readonly isDocument: IsDocument;
  readonly isReverse: IsReverse;

  constructor(model: M, schema: Schema, isDocument: IsDocument, isReverse: IsReverse) {
    this.model = model;
    this.schema = schema;
    this.isDocument = isDocument;
    this.isReverse = isReverse;
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
  peekSchema(peek: (schema: Schema) => void): this {
    peek(this.schema);
    return this;
  }

  select<T extends keyof Shape>(keys: T[]): Exclude<keyof Shape, keyof Select<Shape, T, IsDocument>> extends never ? this : QueryBuilder<M, MongoObject<Select<Shape, T, IsDocument>>, IsDocument, IsReverse> {
    const newSchema = this.schema.select([...keys, ...this.getPreservedMandatoryDocumentProperties()]);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.isReverse) as any;
  }

  unselect<T extends keyof Shape>(keys: T[]): QueryBuilder<M, MongoObject<Omit<Shape, T>>, IsDocument, IsReverse> {
    const newSchema = this.schema.unselect(keys);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.isReverse);
  }

  pick<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MongoObject<ProcessMask<Shape, Mask, IsDocument>>, IsDocument, IsReverse> {
    const presedMandatoryMask = this
      .getPreservedMandatoryDocumentProperties()
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});

    const newSchema = this.schema.pick({
      ...presedMandatoryMask,
      ...mask,
    });
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.isReverse);
  }

  omit<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MongoObject<MaskOmit<Shape, Mask>>, IsDocument, IsReverse> {
    const newSchema = this.schema.omit(mask);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.isReverse);
  }

  where<Key extends keyof Shape, Operator extends TypedComparisonOperator<MongoInfer<Shape[Key]>>>(
    key: Key,
    operator: Operator,
    value: ExpectedOperationType<Shape[Key], Operator>,
  ): QueryBuilder<M, Schema, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.isReverse);
  }

  whereNotNull<Key extends keyof Shape>(key: Key): MergeSelectedNotNull<M, Shape, Key & string, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema as any, this.isDocument, this.isReverse);
  }

  sub<
    Key extends SubObjectKeys<MongoInfer<Schema>>,
    SubQuery extends QueryBuilder<M, MongoObject<MongoRawShape>>,
  >(
    key: Key,
    subQuery: (subQuery: QueryBuilder<M, FindMongoObject<Shape[Key]>>) => SubQuery,
  ): QueryBuilder<M, MongoObject<MergeMongoTypeIntoShape<Shape, Key & string, SubQuery['schema'], Shape[Key & string]>>, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.isReverse) as any;
  }

  whereType<
    Key extends keyof Shape,
    Type extends keyof MongoTypeMap,
  >(
    key: Key,
    type: Type,
  ): MergeSelectedType<M, Shape, Key, Type, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.isReverse) as any;
  }

  not<
    SubQuery extends QueryBuilder<M, MongoObject<MongoRawShape>, IsDocument, boolean>,
  >(
    subQuery: (subQuery: QueryBuilder<M, FindMongoObject<Schema>, IsDocument, ToggleBoolean<IsReverse>>) => SubQuery,
  ): QueryBuilder<M, SubQuery['schema'], IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.isReverse) as any;
  }

  infer<NewSchema extends Schema>(schema: NewSchema): QueryBuilder<M, NewSchema, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, schema, this.isDocument, this.isReverse);
  }

  whereOr<Branch extends OrBranchBuilder<M, MongoObject, any, IsDocument, IsReverse>>(
    buildBranch: (builder: OrBranchBuilder<M, Schema, void, IsDocument, IsReverse>) => Branch
  ): MongoInfer<Schema> extends MongoInfer<InferBranchSchema<Branch>> ? this : QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.isReverse) as any;
  }

  whereAnd<
    Branch extends AndBranchBuilder<M, MongoObject, any>
  >(buildBranch: (builder: AndBranchBuilder<M, Schema>) => Branch): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, IsReverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.isReverse) as any;
  }

  async find(): Promise<MongoInfer<Schema>[]> {
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
  T extends MongoType,
  Operator extends AnyComparisonOperator,
> = (
  // fixes type 'never' for unions including string types
  Operator extends 'regex'
  ? RegExp
  : OperationTypeMap<MongoInfer<T>> extends { [K in InferTypeName<T>]: any }
  ? OperationTypeMap<MongoInfer<T>>[InferTypeName<T>] extends { [K in Operator]: any }
  ? OperationTypeMap<MongoInfer<T>>[InferTypeName<T>][Operator]
  : never
  : never
);

export type OperationTypeMap<T extends MongoType> = {
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

export type MergeMongoTypeIntoShape<T extends MongoRawShape, Key extends string, Value extends MongoType, OriginalValue extends MongoType> = Merge<
  Omit<T, Key>,
  { [K in Key]: ResolveType<Value, OriginalValue> }
> extends infer O ? { [K in keyof O]: O[K] } : never;

export type ResolveType<Value extends MongoType, OriginalType extends MongoType> = (
  ResolveDeepType<Value, OriginalType>
);

export type ResolveShallowType<Value extends MongoType, OriginalType extends MongoType> = (
  OriginalType extends MongoOptional<any>
  ? MongoOptional<Value>
  : OriginalType extends MongoDefault<any>
  ? MongoDefault<Value>
  : OriginalType extends MongoArray<any>
  ? MongoArray<Value>
  : Value
);

export type ResolveDeepType<Value extends MongoType, OriginalType extends MongoType> = (
  OriginalType extends MongoOptional<MongoDefault<MongoArray<any>>>
  ? MongoOptional<MongoDefault<MongoArray<Value>>>
  : OriginalType extends MongoDefault<MongoOptional<MongoArray<any>>>
  ? MongoDefault<MongoOptional<MongoArray<Value>>>
  : OriginalType extends MongoDefault<MongoOptional<any>>
  ? MongoDefault<MongoOptional<Value>>
  : OriginalType extends MongoOptional<MongoDefault<any>>
  ? MongoOptional<MongoDefault<Value>>
  : OriginalType extends MongoDefault<MongoArray<any>>
  ? MongoDefault<MongoArray<Value>>
  : OriginalType extends MongoOptional<MongoArray<any>>
  ? MongoOptional<MongoArray<Value>>
  : ResolveShallowType<Value, OriginalType>
);

export type MergeValueIntoObject<T extends AnyObject, Key extends string, Value> = {
  [K in keyof T & string | Key]: MergedProperty<T[K], K, Key, Value>;
} extends infer O ? { [K in keyof O]: O[K] } : never;

type MergedProperty<P extends object, TK extends string, Key extends string, Value> = TK extends Key ? Value : P;

export type MongoNoOptional<T extends MongoType> = (
  T extends MongoOptional<MongoType>
  ? T['_def']['type']
  : T
);

export type MongoTypeMap = {
  string: MongoString;
  number: MongoNumber;
  boolean: MongoBoolean;
  bigint: MongoBigInt;
  date: MongoDate;
  object: MongoObject<MongoRawShape>;
  array: MongoArray<MongoType>;
  null: MongoNull;
};

type InferTypeName<T extends MongoType> = T['_bsonTypeName'];

type ExtractMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  TypeName extends 'null'
    ? MongoNull
    : ExtractInnerMongoType<T, TypeName>
);

type ExtractInnerMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  MongoNoOptional<T> extends MongoUnion
  ? (MongoNoOptional<T>['_def']['options'][number] & MongoTypeMap[TypeName])
  : (MongoNoOptional<T> & MongoTypeMap[TypeName])
);

type ExcludeMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  TypeName extends 'null'
    ? MongoNull
    : ExcludeInnerMongoType<T, TypeName> extends never
      ? T extends MongoOptional<any>
      ? MongoUnion<[MongoNull, MongoUndefined]>
      : ExcludeInnerMongoType<T, TypeName>
      : ExcludeInnerMongoType<T, TypeName>
);

type ExcludeInnerMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  MongoNoOptional<T> extends MongoUnion
  ? Exclude<MongoNoOptional<T>['_def']['options'][number], MongoTypeMap[TypeName]>
  : Exclude<MongoNoOptional<T>, MongoTypeMap[TypeName]>
);

export type PreserveMandatoryDocumentProperties<T extends MongoRawShape, IsDocument extends boolean> = (
  IsDocument extends true
  ? T extends MandatoryDocumentSchema['_shape']
  ? keyof MandatoryDocumentSchema['_shape']
  : never
  : never
);

export type PickToMask<T extends string> = {
  [K in T]: true;
};

export type ProcessMask<
  Shape extends MongoRawShape,
  Mask extends Partial<Record<keyof Shape, boolean>>,
  IsDocument extends boolean,
> = (
  MaskPick<
    Shape,
    (
      Mask &
      PickToMask<Exclude<PreserveMandatoryDocumentProperties<Shape, IsDocument>, keyof Mask>>
    )
  >
) extends infer O ? { [K in keyof O]: O[K] } : never;

export type Select<
  Shape extends MongoRawShape,
  T extends keyof Shape,
  IsDocument extends boolean
> = Pick<Shape, T | PreserveMandatoryDocumentProperties<Shape, IsDocument>> extends infer O ? { [K in keyof O]: O[K] } : never;

export type MergeSelectedType<
  M extends Model<MongoObject>,
  Shape extends MongoRawShape,
  Key extends keyof Shape,
  Type extends keyof MongoTypeMap,
  IsDocument extends boolean,
  IsReverse extends boolean,
> = QueryBuilder<
  M,
  MongoObject<MergeType<Shape, Key, Type, IsReverse>>,
  IsDocument
> extends QueryBuilder<M, infer R, IsDocument, IsReverse> ? QueryBuilder<M, R, IsDocument, IsReverse> : never;

export type MergeType<
  Shape extends MongoRawShape,
  Key extends keyof Shape,
  Type extends keyof MongoTypeMap,
  IsReverse extends boolean,
> = MergeValueIntoObject<Shape, Key & string, IsReverse extends true ? ExcludeMongoType<Shape[Key], Type> : ExtractMongoType<Shape[Key], Type>>;

export type MergeSelectedNotNull<
  M extends Model<MongoObject>,
  Shape extends MongoRawShape,
  Key extends keyof Shape,
  IsDocument extends boolean,
  IsReverse extends boolean,
> = QueryBuilder<
  M,
  MongoObject<MergeNotNull<Shape, Key, IsReverse>>,
  IsDocument,
  IsReverse
> extends QueryBuilder<M, infer R, IsDocument, IsReverse> ? QueryBuilder<M, R, IsDocument, IsReverse> : never;

export type MergeNotNull<
  Shape extends MongoRawShape,
  Key extends keyof Shape,
  IsReverse extends boolean,
> = MergeValueIntoObject<Shape, Key & string, IsReverse extends true ? MongoOptional<MongoNull> : MongoNoOptional<Shape[Key]>>;

export type ToggleBoolean<T extends boolean> = T extends true ? false : true;
