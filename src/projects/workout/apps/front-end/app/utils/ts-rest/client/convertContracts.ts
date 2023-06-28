import { mapObject } from '@zougui/common.object-utils';

import { contractToRequest } from './contractToRequest';
import type { AnyContract } from '../contract';

export const convertContracts = <T extends Record<string, AnyContract>>(contracts: T) => {
  return mapObject(contracts, contractToRequest);
}
