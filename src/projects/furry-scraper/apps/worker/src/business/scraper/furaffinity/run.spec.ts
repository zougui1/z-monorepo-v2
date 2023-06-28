import { run } from './run';
import * as findNextSubmission from './findNextSubmission';
import * as utils from '../../../utils';
import { FuraffinitySubmission } from '../../../database';

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

  describe('when no submission was found', () => {
    it('should log that the submission was not found', async () => {
      const promiseFindNextSubmission = new Promise<undefined>(resolve => {
        resolve(undefined);
      });
      jest.spyOn(findNextSubmission, 'findNextSubmission').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(utils.processExitScheduler, 'addTask').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      mocks.throttleJob.mockImplementation(async action => action());

      await run();

      expect(findNextSubmission.findNextSubmission).toBeCalledTimes(1);
      expect(utils.processExitScheduler.addTask).toBeCalledWith(promiseFindNextSubmission);
      expect(mocks.throttleJob).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('submission not found');
    });
  });

  describe('when a submission was found', () => {
    it('should log that the submission was found', async () => {
      const promiseFindNextSubmission = new Promise<FuraffinitySubmission.Object>(resolve => {
        resolve({
          _id: 'ozeshbfhbsefug',
        } as FuraffinitySubmission.Object);
      });
      jest.spyOn(findNextSubmission, 'findNextSubmission').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(utils.processExitScheduler, 'addTask').mockReturnValue(promiseFindNextSubmission);
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      mocks.throttleJob.mockImplementation(async action => action());

      await run();

      expect(findNextSubmission.findNextSubmission).toBeCalledTimes(1);
      expect(utils.processExitScheduler.addTask).toBeCalledWith(promiseFindNextSubmission);
      expect(mocks.throttleJob).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('submission found');
    });
  });
});
