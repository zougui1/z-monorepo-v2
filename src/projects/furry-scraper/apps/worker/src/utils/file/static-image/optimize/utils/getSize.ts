import { isNumber } from 'radash';

import { clamp } from '@zougui/common.math-utils';
import { Percent } from '@zougui/common.percent-utils';

import { getConstraintValue } from './getConstraintValue';
import { Size } from '../types';

export const getSize = (size: Size, options: GetSizeOptions): number => {
  if (isNumber(options.max) && options.max <= 0) {
    throw new Error('The maximum size constraint must be greater than 0');
  }

  const min = getConstraintValue(options.min, options.original, 0);
  const max = getConstraintValue(options.max, options.original, Number.MAX_SAFE_INTEGER);

  if (isNumber(size)) {
    if (size <= 0) {
      throw new Error('The size must be greater than 0');
    }

    return clamp(size, min, max);
  }

  if (!options.original) {
    throw new Error('Cannot have a dynamic size without providing the original size.');
  }

  return Math.round(clamp(Percent.apply(size, options.original), min, max));
}

export interface GetSizeOptions {
  original?: number | undefined;
  min: number;
  max: number;
}
