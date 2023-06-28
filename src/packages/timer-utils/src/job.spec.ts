import { Random } from '@zougui/common.random-utils';

import { job, JobOptions } from './job';
import * as wait from './wait';

describe('job', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fixed delay', () => {
    describe('invalid delay', () => {
      it('should throw an error when the delay is undefined', async () => {
        // @ts-expect-error
        const options: JobOptions = { delay: undefined };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the delay is NaN', async () => {
        const options: JobOptions = { delay: NaN };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the delay is Infinity', async () => {
        const options: JobOptions = { delay: Infinity };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the delay is -Infinity', async () => {
        const options: JobOptions = { delay: -Infinity };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the delay is a negative number', async () => {
        const options: JobOptions = { delay: -69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });
    });

    describe('number delay', () => {
      describe('without signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const options: JobOptions = { delay: 69 };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(69, { signal: undefined });
        });
      });

      describe('with a signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const { signal } = new AbortController();
          const options: JobOptions = { delay: 69, signal };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(69, { signal });
        });
      });
    });

    describe('duration string delay', () => {
      describe('without signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const options: JobOptions = { delay: '69 seconds' };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(69000, { signal: undefined });
        });
      });

      describe('with a signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const { signal } = new AbortController();
          const options: JobOptions = { delay: '69 seconds', signal };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(69000, { signal });
        });
      });
    });
  });

  describe('random input', () => {
    describe('invalid min delay', () => {
      it('should throw an error when the min delay is undefined', async () => {
        // @ts-expect-error
        const options: JobOptions = { minDelay: undefined, maxDelay: 69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the min delay is NaN', async () => {
        const options: JobOptions = { minDelay: NaN, maxDelay: 69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the min delay is Infinity', async () => {
        const options: JobOptions = { minDelay: Infinity, maxDelay: 69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the min delay is -Infinity', async () => {
        const options: JobOptions = { minDelay: -Infinity, maxDelay: 69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the min delay is a negative number', async () => {
        const options: JobOptions = { minDelay: -69, maxDelay: 69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });
    });

    describe('invalid max delay', () => {
      it('should throw an error when the max delay is undefined', async () => {
        // @ts-expect-error
        const options: JobOptions = { minDelay: 69, maxDelay: undefined };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the max delay is NaN', async () => {
        const options: JobOptions = { minDelay: 69, maxDelay: NaN };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the max delay is Infinity', async () => {
        const options: JobOptions = { minDelay: 69, maxDelay: Infinity };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the max delay is -Infinity', async () => {
        const options: JobOptions = { minDelay: 69, maxDelay: -Infinity };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });

      it('should throw an error when the max delay is a negative number', async () => {
        const options: JobOptions = { minDelay: 69, maxDelay: -69 };
        const action = jest.fn();

        await expect(() => job(options, action)).rejects.toThrowError();
        expect(action).not.toBeCalled();
      });
    });

    describe('number delay', () => {
      describe('without signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const options: JobOptions = { minDelay: 42, maxDelay: 69 };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);
          jest.spyOn(Random, 'integer').mockReturnValue(56);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(56, { signal: undefined });
          expect(Random.integer).toBeCalledTimes(4);
          expect(Random.integer).toBeCalledWith(42, 69);
        });
      });

      describe('with a signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const { signal } = new AbortController();
          const options: JobOptions = { minDelay: 42, maxDelay: 69, signal };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);
          jest.spyOn(Random, 'integer').mockReturnValue(56);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(56, { signal });
          expect(Random.integer).toBeCalledTimes(4);
          expect(Random.integer).toBeCalledWith(42, 69);
        });
      });
    });

    describe('duration string delay', () => {
      describe('without signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const options: JobOptions = { minDelay: '42 seconds', maxDelay: '69 seconds' };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);
          jest.spyOn(Random, 'integer').mockReturnValue(56000);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(56000, { signal: undefined });
          expect(Random.integer).toBeCalledTimes(4);
          expect(Random.integer).toBeCalledWith(42000, 69000);
        });
      });

      describe('with a signal', () => {
        it('should call the action with an interval until an error is thrown', async () => {
          const { signal } = new AbortController();
          const options: JobOptions = { minDelay: '42 seconds', maxDelay: '69 seconds', signal };
          const action = jest
            .fn()
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValue(new Error('exit infinite loop'));

          jest.clearAllTimers();
          jest.spyOn(wait, 'wait').mockResolvedValue(undefined);
          jest.spyOn(Random, 'integer').mockReturnValue(56000);

          const getResult = () => job(options, action);

          await expect(getResult).rejects.toThrowError('exit infinite loop');
          expect(wait.wait).toBeCalledTimes(3);
          expect(wait.wait).toBeCalledWith(56000, { signal });
          expect(Random.integer).toBeCalledTimes(4);
          expect(Random.integer).toBeCalledWith(42000, 69000);
        });
      });
    });
  });
});
