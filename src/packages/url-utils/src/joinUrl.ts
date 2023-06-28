import _ from 'lodash';
import urlJoin from 'url-join';

import { joinUrlQuery } from './joinUrlQuery';

export const joinUrl = (...urlComponents: string[]): string => {
  const componentQueryStringStart = urlComponents.findIndex(component => component.includes('?'));
  const [urlPathEnd = '', queryStringStart = ''] = urlComponents[componentQueryStringStart]?.split('?') || [];

  const lastPathIndex = componentQueryStringStart >= 0
    ? componentQueryStringStart
    : urlComponents.length;
  const urlPaths = [...urlComponents.slice(0, lastPathIndex), urlPathEnd];

  const urlQueryParts = urlComponents.slice(urlPaths.length).map(queryPart => queryPart.replaceAll('?', ''));
  const urlQuery = joinUrlQuery(queryStringStart, ...urlQueryParts);
  const query = urlQuery ? `?${urlQuery}` : '';

  return `${urlJoin(...urlPaths)}${query}`;
}
