import { BaseBranchBuilder}  from './BaseBranchBuilder';
import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema-v2';
import type { Model } from '../model';
import { MergeMongoDifferences } from '../types';

export class AndBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends MongoObject,
  CurrentSchema extends MongoObject | void = void,
> extends BaseBranchBuilder<M, OriginalSchema, CurrentSchema> {
  branch<
    SubQuery extends QueryBuilder<M, MongoObject>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema>) => SubQuery,
  ): AndBranchBuilder<M, OriginalSchema, CurrentSchema extends MongoObject<any> ? MergeMongoDifferences<CurrentSchema, SubQuery['schema']> : SubQuery['schema']> {
    return new AndBranchBuilder(this.model, this.originalSchema, this.currentSchema) as any;
  }
}
