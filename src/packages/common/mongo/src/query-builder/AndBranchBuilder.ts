import { BaseBranchBuilder}  from './BaseBranchBuilder';
import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema';
import type { Model } from '../model';
import { MergeMongoDifferences } from '../types';

export class AndBranchBuilder<
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
  ): AndBranchBuilder<M, OriginalSchema, CurrentSchema extends MongoObject<any> ? MergeMongoDifferences<CurrentSchema, SubQuery['schema']> : SubQuery['schema'], IsDocument, IsReverse> {
    return new AndBranchBuilder(this.model, this.originalSchema, this.currentSchema) as any;
  }
}
