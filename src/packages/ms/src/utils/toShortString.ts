import { second, minute, hour, day } from '../constants';
import { DurationString } from '../types';

export const toShortString = (ms: number): DurationString => {
  const msAbs = Math.abs(ms);

  if (msAbs >= day) {
    return `${Math.round(ms / day)}d`;
  }

  if (msAbs >= hour) {
    return `${Math.round(ms / hour)}h`;
  }

  if (msAbs >= minute) {
    return `${Math.round(ms / minute)}m`;
  }

  if (msAbs >= second) {
    return `${Math.round(ms / second)}s`;
  }

  return `${ms}ms`;
}
