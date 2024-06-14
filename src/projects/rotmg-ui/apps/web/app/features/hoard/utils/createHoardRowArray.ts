import { range } from 'radash'

import { slotsPerRow } from '~/data/hoard';

export const createHoardRowArray = (): number[] => {
  return Array.from(range(1, slotsPerRow));
}
