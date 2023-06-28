import { ModelPage } from './ModelPage';
import type { PropsSchema, ModelPageConstructor, PageSchema } from './types';
import type { RawPageObjectResponse } from '../../notion-types';

export const createPageModel = <Props extends PropsSchema>(options: PageSchema<Props>): ModelPageConstructor<Props> => {
  return class Model extends ModelPage<Props> {
    constructor(page: RawPageObjectResponse) {
      super(page, options);
    }
  }
}
