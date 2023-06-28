import { Random } from '@zougui/common.random-utils';

import { getDelay } from './getDelay';
import { Delay } from './types';

export const getRandomDelay = (minDelay: Delay, maxDelay: Delay): number => {
  return Random.integer(getDelay(minDelay), getDelay(maxDelay));
}
