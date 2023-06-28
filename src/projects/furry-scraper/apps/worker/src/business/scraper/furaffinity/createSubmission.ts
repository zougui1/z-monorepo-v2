import { SubmissionData } from '@zougui/common.furaffinity';

import { User, FuraffinitySubmission } from '../../../database';

export const createSubmission = async (
  submission: SubmissionData,
  author: User.Object,
): Promise<FuraffinitySubmission.Object> => {
  return await FuraffinitySubmission.Query.create({
    ...submission,
    author,
    id: String(submission.id),
    postedDate: submission.postedDate.toJSDate(),
    status: 'idle',
  });
}
