import { run } from './run';
import * as downloadNextSubmission from './downloadNextSubmission';
import * as utils from '../../../utils';

const mocks = {
  throttleJob: jest.fn(),
};

jest.mock('../../common', () => {
  return {
    throttleJob: (...args: any[]) => mocks.throttleJob(...args),
  };
});

describe('run', () => {
  afterEach(() => {
    mocks.throttleJob.mockReset();
    jest.clearAllMocks();
  });

  describe('when no submission was downloaded', () => {
    it('should log that the submission was not downloaded', async () => {
      const promiseFindNextSubmission = new Promise<{ downloaded: boolean; }>(resolve => {
        resolve({
          downloaded: false,
        } as { downloaded: boolean; });
      });
      jest.spyOn(downloadNextSubmission, 'downloadNextSubmission').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(utils.processExitScheduler, 'addTask').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      mocks.throttleJob.mockImplementation(async action => action());

      await run();

      expect(downloadNextSubmission.downloadNextSubmission).toBeCalledTimes(1);
      expect(utils.processExitScheduler.addTask).toBeCalledWith(promiseFindNextSubmission);
      expect(mocks.throttleJob).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('submission not downloaded');
    });
  });

  describe('when the submission was downloaded', () => {
    it('should log that the submission was downloaded', async () => {
      const promiseFindNextSubmission = new Promise<{ downloaded: boolean; }>(resolve => {
        resolve({
          downloaded: true,
        } as { downloaded: boolean; });
      });
      jest.spyOn(downloadNextSubmission, 'downloadNextSubmission').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(utils.processExitScheduler, 'addTask').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      mocks.throttleJob.mockImplementation(async action => action());

      await run();

      expect(downloadNextSubmission.downloadNextSubmission).toBeCalledTimes(1);
      expect(utils.processExitScheduler.addTask).toBeCalledWith(promiseFindNextSubmission);
      expect(mocks.throttleJob).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('submission downloaded');
    });
  });
});
