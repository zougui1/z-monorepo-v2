import { trimDecimal } from './trimDecimal';

const defaultFractionDigits = 2;
const defaultMax = Infinity;

export const formatPercent = (num: number, options?: FormatPercentOptions) => {
  const fractionDigits = options?.fractionDigits ?? defaultFractionDigits;
  const max = options?.max ?? defaultMax;

  const percent = trimDecimal(Math.min(num, max), fractionDigits);
  return `${percent}%`;
}

export interface FormatPercentOptions {
  /**
   * number of fractional digits to keep
   */
  fractionDigits?: number;
  max?: number;
}
