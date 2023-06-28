import { DateTime } from 'luxon';

import { SubmissionData } from '@zougui/common.furaffinity';

import { createSubmission } from './createSubmission';
import { FuraffinitySubmission, User } from '../../../database';
import { Source } from '../../../enums';

describe('createSubmission', () => {
  const source = Source.Furaffinity;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find an author from furaffinity or create it', async () => {
    const author: User.Object = {
      _id: 'jehzurgfhuiksdjfugfhvijuks',
      id: 'zougui',
      name: 'Zougui',
      profileUrl: 'https://furaffinity.net/user/zougui',
      source,
    };
    const submission = {
      id: 69,
      url: 'https://furaffinity.net/view/69',
      postedDate: DateTime.fromISO('2023-03-18T07:46:55.502Z'),
      author: {
        id: 'zougui',
        name: 'Zougui',
        url: 'https://furaffinity.net/user/zougui',
      },
    };

    jest.spyOn(FuraffinitySubmission.Query, 'create').mockResolvedValue({
      _id: 'dfsjghysdub',
      id: '69',
      url: 'https://furaffinity.net/view/69',
      postedDate: DateTime.fromISO('2023-03-18T07:46:55.502Z'),
      source,
      author,
    } as any);

    const result = await createSubmission(submission as SubmissionData, author);

    expect(result).toEqual({
      _id: 'dfsjghysdub',
      id: '69',
      url: 'https://furaffinity.net/view/69',
      postedDate: DateTime.fromISO('2023-03-18T07:46:55.502Z'),
      source,
      author,
    });
    expect(FuraffinitySubmission.Query.create).toBeCalledWith({
      ...submission,
      author,
      id: String(submission.id),
      postedDate: new Date('2023-03-18T07:46:55.502Z'),
      status: 'idle',
    });
  });
});
