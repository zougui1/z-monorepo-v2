import qs from 'qs';

import { parsePathPattern } from '@zougui/common.url-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

export const buildUrl = (data: BuildUrlData): string => {
  const path = parsePathPattern(data.path).map(pathComponent => {
    if (!pathComponent.isDynamic) {
      return pathComponent.name;
    }

    const param = data.params?.[pathComponent.name];

    if (param) {
      return param;
    }
  }).join('/');

  const query = data.query ? qs.stringify(data.query) : undefined;
  const queryString = query ? `?${query}` : '';
  return `${path}${queryString}`;
}

export interface BuildUrlData {
  path: string;
  params: UnknownObject | undefined;
  query: UnknownObject | undefined;
}
