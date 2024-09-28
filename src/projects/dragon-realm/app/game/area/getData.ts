import zod from 'zod';

import { config } from '~/config';

import { areaSchema, type AreaData } from './parse';
import { readJson } from '../utils';

const schema = zod.array(areaSchema);

export const getData = async (): Promise<AreaData[]> => {
  return await readJson(`${config.game.dataDirectory}/areas.json`, schema);
}
