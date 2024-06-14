import { wait } from './wait';

describe('wait', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('without signal', () => {
    it('should set a timeout', async () => {
      const delay = 69;

      jest.clearAllTimers();
      jest.spyOn(global, 'setTimeout');

      wait(delay);

      expect(setTimeout).toBeCalledWith(expect.any(Function), delay);
    });

    it('should resolve', async () => {
      const delay = 69;
      const waiting = wait(delay);

      jest.runAllTimers();
      await waiting;
    });
  });

  describe('with a signal', () => {
    it('should resolve when the signal has not been aborted', async () => {
      const delay = 69;
      const controller = new AbortController();

      const waiting = wait(delay, { signal: controller.signal });

      jest.runAllTimers();
      await waiting;
    });

    it('should throw an abort error and clear the timeout when the signal has been aborted', async () => {
      const delay = 69;
      const controller = new AbortController();
      const timeoutId = 54874554;
      const reason = 'because I can!';

      jest.spyOn(global, 'setTimeout').mockReturnValue(timeoutId as any);
      jest.spyOn(global, 'clearTimeout');

      const waiting = wait(delay, { signal: controller.signal });
      controller.abort(reason);

      await expect(() => waiting).rejects.toThrowError(reason);
      expect(clearTimeout).toBeCalledWith(timeoutId);
    });
  });
});
