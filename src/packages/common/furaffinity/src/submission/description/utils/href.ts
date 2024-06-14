import { prefixWith } from '@zougui/common.string-utils';
import { secureHttpProtocol, isRelativeUrl } from '@zougui/common.url-utils';

export const getFullHref = (href: string, origin: string): string => {
  return isRelativeUrl(href)
    ? prefixWith(href, origin)
    : secureHttpProtocol(href);
}
