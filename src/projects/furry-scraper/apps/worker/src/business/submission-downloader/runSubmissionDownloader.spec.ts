import { runSubmissionDownloader } from './runSubmissionDownloader';
import env from '../../env';

const mocks = {
  connect: jest.fn(),
  furaffinity: {
    run: jest.fn(),
  },
};

jest.mock('./furaffinity', () => {
  return {
    run: (...args: any[]) => mocks.furaffinity.run(...args),
  };
});

jest.mock('../../database', () => {
  return {
    connect: (...args: any[]) => mocks.connect(...args),
  };
});

describe('runSubmissionDownloader', () => {
  afterEach(() => {
    mocks.connect.mockReset();
    mocks.furaffinity.run.mockReset();
    jest.clearAllMocks();
  });

  it('should connect to the DB and run the downloaders', async () => {
    mocks.connect.mockResolvedValueOnce(undefined);
    mocks.furaffinity.run.mockResolvedValueOnce(undefined);

    await runSubmissionDownloader();

    expect(mocks.connect).toBeCalledWith(env.database.uri);
    expect(mocks.furaffinity.run).toBeCalledTimes(1);
  });
});
