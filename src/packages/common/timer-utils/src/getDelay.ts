import { MS } from '@zougui/common.ms';

import { Delay } from './types';

export const getDelay = (delay: Delay): number => {
  const milliseconds = MS.toNumber(delay);

  if (!Number.isFinite(milliseconds)) {
    throw new Error('Invalid delay.');
  }

  if (milliseconds <= 0) {
    throw new Error('Delay cannot be a negative number.');
  }

  return milliseconds;
}
