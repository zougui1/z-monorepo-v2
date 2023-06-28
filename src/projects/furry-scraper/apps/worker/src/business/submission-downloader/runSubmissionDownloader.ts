import * as furaffinity from './furaffinity';
import { connect } from '../../database';
import env from '../../env';

export const runSubmissionDownloader = async (): Promise<void> => {
  await connect(env.database.uri);

  await Promise.all([
    furaffinity.run(),
  ]);
}
