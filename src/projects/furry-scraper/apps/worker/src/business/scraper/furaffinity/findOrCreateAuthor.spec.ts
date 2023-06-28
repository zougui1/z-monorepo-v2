import { SubmissionData } from '@zougui/common.furaffinity';

import { findOrCreateAuthor } from './findOrCreateAuthor';
import { User } from '../../../database';
import { Source } from '../../../enums';

describe('findOrCreateAuthor', () => {
  const source = Source.Furaffinity;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find an author from furaffinity or create it', async () => {
    const author: SubmissionData['author'] = {
      id: 'zougui',
      name: 'Zougui',
      url: 'https://furaffinity.net/user/zougui',
    };

    jest.spyOn(User.Query, 'findOrCreate').mockResolvedValue({
      _id: 'dfsjghysdub',
      id: 'zougui',
      name: 'Zougui',
      profileUrl: 'https://furaffinity.net/user/zougui',
      source,
    } as any);

    const result = await findOrCreateAuthor(author);

    expect(result).toEqual({
      _id: 'dfsjghysdub',
      id: 'zougui',
      name: 'Zougui',
      profileUrl: 'https://furaffinity.net/user/zougui',
      source,
    });
    expect(User.Query.findOrCreate).toBeCalledWith({
      id: 'zougui',
      name: 'Zougui',
      profileUrl: 'https://furaffinity.net/user/zougui',
      source,
    });
  });
});
