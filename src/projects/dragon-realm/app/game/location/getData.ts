import zod from 'zod';

import { config } from '~/config';

import { locationSchema, type LocationData } from './parse';
import { readJson } from '../utils';

const schema = zod.array(locationSchema);

export const getData = async (): Promise<LocationData[]> => {
  return await readJson(`${config.game.dataDirectory}/locations.json`, schema);
}
