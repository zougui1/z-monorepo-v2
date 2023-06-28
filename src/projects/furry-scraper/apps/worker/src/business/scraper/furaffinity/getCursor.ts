import { source } from './client';
import { Cursor } from '../../../database';

export const getCursor = async (): Promise<Cursor.Object> => {
  return await Cursor.Query.findOrCreate(source, {
    lastSubmissionId: '0',
    status: Cursor.Status.Idle,
  });
}
