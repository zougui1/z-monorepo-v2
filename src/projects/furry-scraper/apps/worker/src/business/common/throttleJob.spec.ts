import { throttleJob } from './throttleJob';
import env from '../../env';

const mocks = {
  job: jest.fn(),
};

jest.mock('@zougui/common.timer-utils', () => {
  return {
    job: (...args: any[]) => mocks.job(...args),
  };
});

describe('throttleJob', () => {
  afterEach(() => {
    mocks.job.mockReset();
    jest.clearAllMocks();
  });

  it('should wait randomly based on env vars', async () => {
    const action = () => { };
    const { min, max } = env.scraper.throttle;

    await throttleJob(action);
    expect(mocks.job).toBeCalledWith({ minDelay: min, maxDelay: max }, action);
  });
});
