import {
  reDurationString,
  second,
  minute,
  hour,
  day,
  week,
  year,
} from './constants';
import { checkLength } from './checks';
import { Unit } from './types';

export const parse = (str: string): number => {
  str = String(str);
  checkLength(str);

  const match = reDurationString.exec(str);

  if (!match) {
    throw new Error('Invalid duration string');
  }

  const number = Number(match[1]);
  const type = (match[2] || 'ms').toLowerCase() as Lowercase<Unit>;

  // istanbul ignore next
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return number * year;

    case 'weeks':
    case 'week':
    case 'w':
      return number * week;

    case 'days':
    case 'day':
    case 'd':
      return number * day;

    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return number * hour;

    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return number * minute;

    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return number * second;

    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return number;

    default:
      // This should never occur.
      /* istanbul ignore next */
      throw new Error(
        `The unit ${type as string} was matched, but no matching case exists.`,
      );
  }
}
