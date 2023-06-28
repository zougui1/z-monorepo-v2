import * as furaffinity from './furaffinity';
import { connect } from '../../database';
import env from '../../env';

export const runScraper = async () => {
  await connect(env.database.uri);

  await Promise.all([
    furaffinity.run(),
  ]);
};
