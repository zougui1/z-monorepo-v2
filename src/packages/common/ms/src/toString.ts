import { toLongString, toShortString, toVerboseString } from './utils';

const formatters: Record<DurationFormat, (ms: number) => string> = {
  long: toLongString,
  short: toShortString,
  verbose: toVerboseString,
};
const defaultFormat: DurationFormat = 'short';
const defaultFormatter = formatters[defaultFormat];

export const toString = (value: number, options?: ToStringOptions | undefined): string => {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid number.');
  }

  const formatter = formatters[options?.format || defaultFormat] || defaultFormatter;
  return formatter(value);
}

export interface ToStringOptions {
  format?: DurationFormat | undefined;
}

export type DurationFormat = 'short' | 'long' | 'verbose';
