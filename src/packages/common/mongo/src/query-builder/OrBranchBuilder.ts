import { BaseBranchBuilder } from './BaseBranchBuilder';
import { QueryBuilder } from './QueryBuilder';
import type { MongoInfer, MongoObject } from '../schema';
import type { Model } from '../model';
import { MergeMongoDifferences } from '../types';

export class OrBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends MongoObject,
  CurrentSchema extends MongoObject | void = void,
  IsDocument extends boolean = false,
  IsReverse extends boolean = false,
> extends BaseBranchBuilder<M, OriginalSchema, CurrentSchema, IsDocument, IsReverse> {
  branch<
    SubQuery extends QueryBuilder<M, MongoObject, boolean, boolean>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema, IsDocument, IsReverse>) => SubQuery,
  ): OrResult<M, OriginalSchema, CurrentSchema, SubQuery, IsDocument, IsReverse> {
    return new OrBranchBuilder(this.model, this.originalSchema, this.currentSchema) as any;
  }
}

type OrResult<
  M extends Model<MongoObject>,
  OriginalSchema extends MongoObject,
  CurrentSchema extends MongoObject | void,
  SubQuery extends QueryBuilder<M, MongoObject, boolean, boolean>,
  IsDocument extends boolean = false,
  IsReverse extends boolean = false,
> = OrBranchBuilder<
  M,
  OriginalSchema,
  CurrentSchema extends MongoObject
  ? MongoInfer<MergeMongoDifferences<CurrentSchema, SubQuery['schema']>> extends MongoInfer<CurrentSchema>
    ? SubQuery['schema']
    : MergeMongoDifferences<CurrentSchema, SubQuery['schema']>
  : SubQuery['schema'],
  IsDocument,
  IsReverse
> extends OrBranchBuilder<M, OriginalSchema, infer R, IsDocument, IsReverse> ? OrBranchBuilder<M, OriginalSchema, R, IsDocument, IsReverse> : never;
