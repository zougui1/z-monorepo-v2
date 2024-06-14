import { plural } from './plural';
import { second, minute, hour, day } from '../constants';
import { DurationString } from '../types';

export const toLongString = (ms: number): DurationString => {
  const msAbs = Math.abs(ms);

  if (msAbs >= day) {
    return plural(ms, msAbs, day, 'day');
  }

  if (msAbs >= hour) {
    return plural(ms, msAbs, hour, 'hour');
  }

  if (msAbs >= minute) {
    return plural(ms, msAbs, minute, 'minute');
  }

  if (msAbs >= second) {
    return plural(ms, msAbs, second, 'second');
  }

  return `${ms} ms`;
}
