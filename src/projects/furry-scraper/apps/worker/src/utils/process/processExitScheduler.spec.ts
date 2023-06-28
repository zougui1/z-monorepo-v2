import { processExitScheduler } from './processExitScheduler';

const mocks = {
  offProgramExit: jest.fn(),
  onceProgramExit: jest.fn(),
  setTimeout: jest.fn(),
};

jest.mock('node:timers/promises', () => {
  return {
    setTimeout: (...args: any[]) => mocks.setTimeout(...args),
  };
});

jest.mock('./onceProgramExit', () => {
  return {
    onceProgramExit: (...args: any[]) => mocks.onceProgramExit(...args),
  };
});

describe('processExitScheduler', () => {
  const originalProcessExit = process.exit;
  const maxTimeout = 2_147_483_647;

  afterEach(() => {
    mocks.setTimeout.mockReset();
    mocks.onceProgramExit.mockReset();
    jest.clearAllMocks();
    processExitScheduler.stop();
    process.exit = originalProcessExit;
  });

  describe('start', () => {
    it('should start only once', () => {
      mocks.onceProgramExit.mockImplementation(() => {
        return mocks.offProgramExit;
      });

      processExitScheduler.start();
      processExitScheduler.start();

      expect(mocks.onceProgramExit).toBeCalledTimes(1);
    });
  });

  describe('stop', () => {
    it('should not crash even if there is nothing to stop', () => {
      processExitScheduler.stop();
    });
  });

  describe('addTask', () => {
    it('should wait until the tasks are finished before exiting the process', async () => {
      let resolve: (arg?: unknown) => void;
      const task = new Promise(res => resolve = res);

      // @ts-ignore
      process.exit = jest.fn();
      mocks.onceProgramExit.mockImplementation(() => {
        return mocks.offProgramExit;
      });

      const taskPromise = processExitScheduler.start().addTask(task);

      expect(mocks.onceProgramExit).toBeCalledTimes(1);

      // call the callback of `onceProgramExit`
      mocks.onceProgramExit.mock.calls[0][0]();
      resolve!();
      await taskPromise;

      expect(mocks.setTimeout).not.toBeCalled();
      expect(process.exit).toBeCalledTimes(1);
    });

    it('should wait indefinitely when already waiting for the process to exit', async () => {
      let resolve: (arg?: unknown) => void;
      const task = new Promise(res => resolve = res);

      // @ts-ignore
      process.exit = jest.fn();
      mocks.onceProgramExit.mockImplementation(callback => {
        callback();
        return mocks.offProgramExit;
      });

      resolve!();
      await processExitScheduler.start().addTask(task);

      expect(mocks.onceProgramExit).toBeCalledTimes(1);
      expect(mocks.setTimeout).toBeCalledTimes(1);
      expect(mocks.setTimeout).toBeCalledWith(maxTimeout);
      expect(process.exit).toBeCalledTimes(1);
    });
  });
});
