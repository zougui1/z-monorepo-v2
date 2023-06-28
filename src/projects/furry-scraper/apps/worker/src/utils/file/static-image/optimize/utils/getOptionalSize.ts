import { isNumber } from 'radash';

import { getSize, GetSizeOptions } from './getSize';
import { Size } from '../types';

export const getOptionalSize = (size: Size | undefined, options: GetSizeOptions): number | undefined => {
  if (!isNumber(size) && typeof size !== 'string') {
    return;
  }

  return getSize(size, options);
}
