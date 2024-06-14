import { wait, WaitOptions } from './wait';
import { getRandomDelay } from './getRandomDelay';
import { Delay } from './types';

export const waitRandom = async (
  minDelay: Delay,
  maxDelay: Delay,
  options?: WaitOptions | undefined,
): Promise<void> => {
  const delay = getRandomDelay(minDelay, maxDelay);
  await wait(delay, options);
}
