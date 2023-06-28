import zod from 'zod';

import { UrlBuilder } from '@zougui/common.url-utils';

export const submissionUrl = new UrlBuilder()
  .allowedHosts(['furaffinity.net', 'www.furaffinity.net'])
  .allowedProtocols(['https', 'http'])
  .path('/view/:id', { id: zod.coerce.number().finite() });

export type ParsedUrl = ReturnType<typeof submissionUrl['parse']>;
