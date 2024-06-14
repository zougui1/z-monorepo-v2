import { getDelay } from './getDelay';
import { getRandomDelay } from './getRandomDelay';
import { wait } from './wait';
import { Delay } from './types';

const getJobDelay = (options: JobOptions): number => {
  if ('delay' in options) {
    return getDelay(options.delay);
  }

  return getRandomDelay(options.minDelay, options.maxDelay);
}

export const job = async (options: JobOptions, action: () => (void | Promise<void>)): Promise<void> => {
  // copy object to prevent mutations
  options = { ...options };
  // does a preliminary check to validate the delay
  getJobDelay(options);

  while (true) {
    await action();
    await wait(getJobDelay(options), { signal: options.signal });
  }
}

interface BaseJobOptions {
  signal?: AbortSignal | undefined;
}

export interface JobFixedDelayOptions extends BaseJobOptions {
  delay: Delay;
}

export interface JobRandomDelayOptions extends BaseJobOptions {
  minDelay: Delay;
  maxDelay: Delay;
}

export type JobOptions = JobFixedDelayOptions | JobRandomDelayOptions;
