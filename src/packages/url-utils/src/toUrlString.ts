import QS from 'qs';

import { UnknownObject } from '@zougui/common.type-utils';

import { joinUrl } from './joinUrl';

export const toUrlString = (url: string, query?: UnknownObject | undefined): string => {
  return query
    ? joinUrl(url, `?${QS.stringify(query)}`)
    : url;
}
