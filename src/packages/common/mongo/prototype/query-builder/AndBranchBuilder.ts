import { BaseBranchBuilder}  from './BaseBranchBuilder';
import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema-v2';
import type { Model } from '../model';
import { MergeMongoDifferences } from '../types';

export class AndBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends object,
  CurrentSchema extends object | void = void,
> extends BaseBranchBuilder<M, OriginalSchema, CurrentSchema> {
  branch<
    SubQuery extends QueryBuilder<M, object>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema>) => SubQuery,
  ): AndBranchBuilder<M, OriginalSchema, CurrentSchema extends object ? MergeMongoDifferences<CurrentSchema, SubQuery['_shape']> : SubQuery['_shape']> {
    return new AndBranchBuilder(this.model, this.originalSchema, this.currentSchema) as any;
  }
}
