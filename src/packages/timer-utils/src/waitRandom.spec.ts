import { Random } from '@zougui/common.random-utils';

import { waitRandom } from './waitRandom';
import * as wait from './wait';

describe('waitRandom', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('without signal', () => {
    it('should wait with a random delay', async () => {
      const min = 42;
      const max = 100;

      jest.spyOn(Random, 'integer').mockReturnValue(69);
      jest.spyOn(wait, 'wait').mockResolvedValue(undefined);

      await waitRandom(min, max);

      expect(Random.integer).toBeCalledWith(min, max);
      expect(wait.wait).toBeCalledWith(69, undefined);
    });
  });

  describe('with a signal', () => {
    it('should wait with random delay and an abort signal', async () => {
      const min = 42;
      const max = 100;
      const controller = new AbortController();
      const options = {
        signal: controller.signal,
      };

      jest.spyOn(Random, 'integer').mockReturnValue(69);
      jest.spyOn(wait, 'wait').mockResolvedValue(undefined);

      await waitRandom(min, max, options);

      expect(Random.integer).toBeCalledWith(min, max);
      expect(wait.wait).toBeCalledWith(69, { signal: controller.signal });
    });
  });
});
