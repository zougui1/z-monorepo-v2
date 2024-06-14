import { ModelDatabasePage } from './ModelDatabasePage';
import type { PropsSchema, ModelDatabasePageConstructor } from './types';
import type { RawDatabaseObjectResponse } from '../../../notion-types';

export const createDatabaseModel = <Props extends PropsSchema>(options: CreateModelOptions<Props>): ModelDatabasePageConstructor<Props> => {
  return class Model extends ModelDatabasePage<Props> {
    constructor(database: RawDatabaseObjectResponse) {
      super(database, options);
    }
  }
}

export interface CreateModelOptions<Props extends PropsSchema> {
  properties: Props;
}
