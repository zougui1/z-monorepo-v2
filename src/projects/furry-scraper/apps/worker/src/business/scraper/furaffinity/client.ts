import { Furaffinity } from '@zougui/common.furaffinity';

import { Source } from '../../../enums';
import env from '../../../env';

export const client = new Furaffinity({
  cookieA: env.furaffinity.cookieA,
  cookieB: env.furaffinity.cookieB,
});

export const source = Source.Furaffinity;
