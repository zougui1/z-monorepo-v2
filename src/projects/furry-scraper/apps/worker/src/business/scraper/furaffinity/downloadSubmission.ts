import { client } from './client';
import { findOrCreateAuthor } from './findOrCreateAuthor';
import { createSubmission } from './createSubmission';
import { FuraffinitySubmission } from '../../../database';

export const downloadSubmission = async (id: number): Promise<FuraffinitySubmission.Object | undefined> => {
  const submission = await client.submission.findOne(id);

  if (!submission) {
    return;
  }

  const duplicated = await FuraffinitySubmission.Query.findOneByUrl({
    url: submission.url,
    downloadUrl: submission.downloadUrl,
  });

  if (duplicated) {
    return;
  }

  const author = await findOrCreateAuthor(submission.author);
  return await createSubmission(submission, author);
}
