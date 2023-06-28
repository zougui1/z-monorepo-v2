import { job } from '@zougui/common.timer-utils';

import env from '../../env';

export const throttleJob = async (action: () => void): Promise<void> => {
  const { min, max } = env.scraper.throttle;
  await job({ minDelay: min, maxDelay: max }, action);
}
