import { Unit, DurationString } from '../types';

export const plural = (
  ms: number,
  msAbs: number,
  number: number,
  name: Lowercase<Unit>,
): DurationString => {
  const isPlural = msAbs >= number * 1.5;
  const value = Math.round(ms / number);
  const label = `${name}${isPlural ? 's' : ''}`;

  return `${value} ${label}` as DurationString;
}
