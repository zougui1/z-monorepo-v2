import { SubmissionData } from '@zougui/common.furaffinity';

import { source } from './client';
import { User } from '../../../database';

export const findOrCreateAuthor = async (author: SubmissionData['author']): Promise<User.Object> => {
  return await User.Query.findOrCreate({
    id: author.id,
    name: author.name,
    profileUrl: author.url,
    avatarUrl: author.avatar,
    source,
  });
};
