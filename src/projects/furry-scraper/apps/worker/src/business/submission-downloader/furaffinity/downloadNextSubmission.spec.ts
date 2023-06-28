import { downloadNextSubmission } from './downloadNextSubmission';
import * as downloadSubmission from './downloadSubmission';
import { FuraffinitySubmission, Submission } from '../../../database';

describe('downloadNextSubmission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the result of the submission not downloaded when there is no submission', async () => {
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'updateStatus').mockResolvedValue(undefined);
    jest.spyOn(Submission.Query, 'addPost').mockResolvedValue(undefined);
    jest.spyOn(Submission.Query, 'create').mockResolvedValue({} as any);
    jest.spyOn(downloadSubmission, 'downloadSubmission').mockResolvedValue({} as any);

    const result = await downloadNextSubmission();

    expect(result).toEqual({ downloaded: false });
    expect(FuraffinitySubmission.Query.updateStatus).not.toBeCalled();
    expect(Submission.Query.addPost).not.toBeCalled();
    expect(Submission.Query.create).not.toBeCalled();
    expect(downloadSubmission.downloadSubmission).not.toBeCalled();
  });

  it('should return the result of the submission not downloaded when an error occured', async () => {
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'updateStatus').mockResolvedValue(undefined);
    jest.spyOn(Submission.Query, 'addPost').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue({
      _id: 'sdufhsuefib',
      id: '69',
    } as any);
    jest.spyOn(downloadSubmission, 'downloadSubmission').mockRejectedValue(new Error('oh no'));

    const result = await downloadNextSubmission();

    expect(result).toEqual({ downloaded: false });
    expect(FuraffinitySubmission.Query.updateStatus).toBeCalledWith(
      '69',
      FuraffinitySubmission.Status.Downloading,
    );
    expect(downloadSubmission.downloadSubmission).toBeCalledWith({
      _id: 'sdufhsuefib',
      id: '69',
    });
    expect(FuraffinitySubmission.Query.updateStatus).toBeCalledWith(
      '69',
      FuraffinitySubmission.Status.Error,
      { error: 'oh no' },
    );
    expect(Submission.Query.create).not.toBeCalled();
    expect(Submission.Query.addPost).not.toBeCalled();
  });

  it('should return the result of the submission downloaded when there is a submission', async () => {
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'updateStatus').mockResolvedValue(undefined);
    jest.spyOn(Submission.Query, 'addPost').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue({
      _id: 'sdufhsuefib',
      id: '69',
    } as any);
    jest.spyOn(downloadSubmission, 'downloadSubmission').mockResolvedValue({
      status: FuraffinitySubmission.Status.Success,
      post: {
        id: '69',
      } as any,
    });

    const result = await downloadNextSubmission();

    expect(result).toEqual({ downloaded: true });
    expect(FuraffinitySubmission.Query.updateStatus).toBeCalledWith(
      '69',
      FuraffinitySubmission.Status.Downloading,
    );
    expect(downloadSubmission.downloadSubmission).toBeCalledWith({
      _id: 'sdufhsuefib',
      id: '69',
    });
    expect(FuraffinitySubmission.Query.updateStatus).toBeCalledWith(
      '69',
      FuraffinitySubmission.Status.Success,
      undefined,
    );
    expect(Submission.Query.create).toBeCalledWith({
      posts: [
        {
          id: '69',
        },
      ],
    });
    expect(Submission.Query.addPost).not.toBeCalled();
  });

  it('should return the result of the submission downloaded when it is a duplicate', async () => {
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'updateStatus').mockResolvedValue(undefined);
    jest.spyOn(Submission.Query, 'addPost').mockResolvedValue(undefined);
    jest.spyOn(FuraffinitySubmission.Query, 'findOneIdle').mockResolvedValue({
      _id: 'sdufhsuefib',
      id: '69',
    } as any);
    jest.spyOn(downloadSubmission, 'downloadSubmission').mockResolvedValue({
      status: FuraffinitySubmission.Status.Duplicate,
      post: {
        id: '69',
      } as any,
      duplicate: {
        _id: 'opjisdfgu',
        id: '42',
      },
    });

    const result = await downloadNextSubmission();

    expect(result).toEqual({ downloaded: true });
    expect(FuraffinitySubmission.Query.updateStatus).toBeCalledWith(
      '69',
      FuraffinitySubmission.Status.Downloading,
    );
    expect(downloadSubmission.downloadSubmission).toBeCalledWith({
      _id: 'sdufhsuefib',
      id: '69',
    });
    expect(FuraffinitySubmission.Query.updateStatus).toBeCalledWith(
      '69',
      FuraffinitySubmission.Status.Duplicate,
      { duplicatesIds: ['42'] },
    );
    expect(Submission.Query.addPost).toBeCalledWith(
      'opjisdfgu',
      {
        id: '69',
      },
    );
    expect(Submission.Query.create).not.toBeCalled();
  });
});
