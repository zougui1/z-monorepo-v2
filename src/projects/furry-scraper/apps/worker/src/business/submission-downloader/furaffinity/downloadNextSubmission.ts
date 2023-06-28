import { tryit } from 'radash';

import { downloadSubmission } from './downloadSubmission';
import { FuraffinitySubmission, Submission } from '../../../database';
import { getErrorMessage } from '../../../utils';

export const downloadNextSubmission = async (): Promise<{ downloaded: boolean }> => {
  const submission = await FuraffinitySubmission.Query.findOneIdle();

  if (!submission) {
    return { downloaded: false };
  }

  await FuraffinitySubmission.Query.updateStatus(
    submission.id,
    FuraffinitySubmission.Status.Downloading,
  );

  const [error, result] = await tryit(downloadSubmission)(submission);

  if (error) {
    await FuraffinitySubmission.Query.updateStatus(
      submission.id,
      FuraffinitySubmission.Status.Error,
      { error: getErrorMessage(error) },
    );
    return { downloaded: false };
  }

  await Promise.all([
    FuraffinitySubmission.Query.updateStatus(
      submission.id,
      result.status,
      result.duplicate ? { duplicatesIds: [result.duplicate.id] } : undefined,
    ),
    result.status === FuraffinitySubmission.Status.Duplicate && result.duplicate
      ? Submission.Query.addPost(result.duplicate._id, result.post)
      : Submission.Query.create({ posts: [result.post] }),
  ]);

  return { downloaded: true };
}
