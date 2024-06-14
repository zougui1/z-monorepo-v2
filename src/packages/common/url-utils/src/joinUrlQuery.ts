import { join } from '@zougui/common.string-utils';

export const joinUrlQuery = (...queries: string[]): string => {
  return join(queries, '&');
}
