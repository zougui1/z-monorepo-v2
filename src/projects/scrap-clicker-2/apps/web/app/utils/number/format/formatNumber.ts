import { toScientificNotation } from './toScientificNotation';

const defaultThreshold = 6;

export const formatNumber = (num: number, options?: FormatNumberOptions): string => {
  // Convert the number to exponential notation if it has more than threshold digits
  if (Math.abs(num) >= Math.pow(10, options?.threshold ?? defaultThreshold)) {
    return toScientificNotation(num, options?.fractionDigits);
  }

  // Otherwise, return the number in regular notation with commas
  return num.toLocaleString('en-US');
}

export interface FormatNumberOptions {
  /**
   * threshold at which the number should be formatted in the regular number notation
   */
  threshold?: number;
  /**
   * fraction digits to keep for the scientific notation
   */
  fractionDigits?: number;
}
