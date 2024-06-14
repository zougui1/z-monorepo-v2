import { getDelay } from './getDelay';
import { Delay } from './types';

export const wait = (delay: Delay, options?: WaitOptions | undefined): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, getDelay(delay));
    const { signal } = options || {};

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      // @ts-ignore for some reason the type AbortSignal does not have
      // a property 'reason'
      const abortError = new Error(signal.reason);
      abortError.name = 'AbortError';

      reject(abortError);
    });
  });
}

export interface WaitOptions {
  signal?: AbortSignal | undefined;
}
