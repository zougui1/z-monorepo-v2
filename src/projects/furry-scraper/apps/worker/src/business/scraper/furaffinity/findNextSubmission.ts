import { tryit } from 'radash';

import { getCursor } from './getCursor';
import { source } from './client';
import { downloadSubmission } from './downloadSubmission';
import { FuraffinitySubmission, Cursor } from '../../../database';

export const findNextSubmission = async (): Promise<FuraffinitySubmission.Object | undefined> => {
  const cursor = await getCursor();

  if (cursor.status === Cursor.Status.Running) {
    return;
  }

  const nextSubmissionId = Number(cursor.lastSubmissionId) + 1;

  await Cursor.Query.updateStatus(source, Cursor.Status.Running);
  const [error, submissionDocument] = await tryit(downloadSubmission)(nextSubmissionId);

  if (error) {
    await Cursor.Query.updateStatus(source, Cursor.Status.Error, {
      error: error.message,
    });
    return;
  }

  await Cursor.Query.advance(source, String(nextSubmissionId));
  return submissionDocument;
}
