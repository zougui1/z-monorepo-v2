import type { Percent } from '@zougui/common.percent-utils';

export type Size = number | Percent.StringType;

export interface Dimensions {
  width: number;
  height: number;
}
