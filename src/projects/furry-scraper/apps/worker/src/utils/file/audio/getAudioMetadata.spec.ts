import { getAudioMetadata } from './getAudioMetadata';

const mocks = {
  stat: jest.fn(),
  getAudioDurationInSeconds: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    stat: (...args: any[]) => mocks.stat(...args),
  };
});

jest.mock('get-audio-duration', () => {
  return {
    getAudioDurationInSeconds: (...args: any[]) => mocks.getAudioDurationInSeconds(...args),
  };
});

describe('getAudioMetadata', () => {
  afterEach(() => {
    mocks.stat.mockReset();
    mocks.getAudioDurationInSeconds.mockReset();
    jest.clearAllMocks();
  });

  it('should return the metadata of the audio file', async () => {
    const file = 'dragons/sexy-stuff.png';

    mocks.stat.mockResolvedValue({ size: 69420 });
    mocks.getAudioDurationInSeconds.mockResolvedValue(56);

    const result = await getAudioMetadata(file);

    expect(result).toEqual({
      size: 69420,
      duration: 56,
    });
    expect(mocks.stat).toBeCalledTimes(1);
    expect(mocks.stat).toBeCalledWith(file);
    expect(mocks.getAudioDurationInSeconds).toBeCalledTimes(1);
    expect(mocks.getAudioDurationInSeconds).toBeCalledWith(file);
  });
});
