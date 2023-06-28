import { Options } from 'execa';

import { getVideoMetadata } from './getVideoMetadata';

const mocks = {
  execa: jest.fn(),
};

jest.mock('execa', () => {
  return (...args: any[]) => mocks.execa(...args);
});

describe('getVideoMetadata', () => {
  const originalEnv = Object.assign({}, process.env);

  afterEach(() => {
    mocks.execa.mockReset();
    jest.clearAllMocks();
    Object.assign(process.env, originalEnv);
  });

  it('should return the metadata of the video file', async () => {
    const videoFile = 'dragons/sexy-stuff.mp4';

    const executable = 'ffprobe';
    const args = [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-count_frames',
      '-show_entries',
      'stream=width,height,duration,codec_type,codec_name,codec_long_name,bit_rate,size,display_aspect_ratio,r_frame_rate,nb_read_frames',
      videoFile,
    ];
    const options: Options = {
      windowsHide: true,
    };

    mocks.execa.mockResolvedValue({
      stdout: [
        '',
        '[FORMAT]',
        '',
        'noValue',
        'codec_name=whatever',
        'codec_long_name=super long whatever',
        'codec_type=sure',
        'display_aspect_ratio=16:9',
        'width=1456',
        'height=8564',
        'r_frame_rate=60/2',
        'nb_read_frames=250',
        'bit_rate=512',
        'duration=13',
        '',
        '[/FORMAT]',
        '',
      ].join('\n'),
    });

    const result = await getVideoMetadata(videoFile);

    expect(result).toEqual({
      codec: {
        name: 'whatever',
        longName: 'super long whatever',
        type: 'sure',
      },
      aspectRatio: '16:9',
      width: 1456,
      height: 8564,
      frameRate: 30,
      frameCount: 250,
      bitRate: 512,
      duration: 13,
    });
    expect(mocks.execa).toBeCalledTimes(1);
    expect(mocks.execa).toBeCalledWith(executable, args, options);
  });

  it('should return the default metadata when they could not be found', async () => {
    const videoFile = 'dragons/sexy-stuff.mp4';

    const executable = 'ffprobe';
    const args = [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-count_frames',
      '-show_entries',
      'stream=width,height,duration,codec_type,codec_name,codec_long_name,bit_rate,size,display_aspect_ratio,r_frame_rate,nb_read_frames',
      videoFile,
    ];
    const options: Options = {
      windowsHide: true,
    };

    mocks.execa.mockResolvedValue({
      stdout: '',
    });

    const result = await getVideoMetadata(videoFile);

    expect(result).toEqual({
      codec: {
        name: undefined,
        longName: undefined,
        type: undefined,
      },
      aspectRatio: undefined,
      width: undefined,
      height: undefined,
      frameRate: undefined,
      frameCount: undefined,
      bitRate: undefined,
      duration: undefined,
    });
    expect(mocks.execa).toBeCalledTimes(1);
    expect(mocks.execa).toBeCalledWith(executable, args, options);
  });

  it('should not throw when the frame rate divider is 0', async () => {
    const videoFile = 'dragons/sexy-stuff.mp4';

    const executable = 'ffprobe';
    const args = [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-count_frames',
      '-show_entries',
      'stream=width,height,duration,codec_type,codec_name,codec_long_name,bit_rate,size,display_aspect_ratio,r_frame_rate,nb_read_frames',
      videoFile,
    ];
    const options: Options = {
      windowsHide: true,
    };

    mocks.execa.mockResolvedValue({
      stdout: [
        'r_frame_rate=60/0',
      ].join('\n'),
    });

    const result = await getVideoMetadata(videoFile);

    expect(result).toEqual({
      codec: {
        name: undefined,
        longName: undefined,
        type: undefined,
      },
      aspectRatio: undefined,
      width: undefined,
      height: undefined,
      frameRate: 60,
      frameCount: undefined,
      bitRate: undefined,
      duration: undefined,
    });
    expect(mocks.execa).toBeCalledTimes(1);
    expect(mocks.execa).toBeCalledWith(executable, args, options);
  });

  it('should use another executable based on the env var', async () => {
    const videoFile = 'dragons/sexy-stuff.mp4';

    const executable = '/path/to/super-ffprobe';
    const args = [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-count_frames',
      '-show_entries',
      'stream=width,height,duration,codec_type,codec_name,codec_long_name,bit_rate,size,display_aspect_ratio,r_frame_rate,nb_read_frames',
      videoFile,
    ];
    const options: Options = {
      windowsHide: true,
    };

    mocks.execa.mockResolvedValue({
      stdout: [
        'r_frame_rate=60/0',
      ].join('\n'),
    });

    process.env.FFPROBE_EXEC = executable;

    const result = await getVideoMetadata(videoFile);

    expect(result).toEqual({
      codec: {
        name: undefined,
        longName: undefined,
        type: undefined,
      },
      aspectRatio: undefined,
      width: undefined,
      height: undefined,
      frameRate: 60,
      frameCount: undefined,
      bitRate: undefined,
      duration: undefined,
    });
    expect(mocks.execa).toBeCalledTimes(1);
    expect(mocks.execa).toBeCalledWith(executable, args, options);
  });
});
