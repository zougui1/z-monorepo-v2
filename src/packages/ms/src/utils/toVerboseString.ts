import prettyMilliseconds from 'pretty-ms';

import { DurationString } from '../types';

export const toVerboseString = (ms: number): DurationString => {
  if (ms <= 0) {
    return prettyMilliseconds(ms, { verbose: true }) as DurationString;
  }

  // the functions returns `{seconds}.{milliseconds} seconds` when there are milliseconds and the value is positive
  // but when the value is negative the function returns `{seconds} seconds {milliseconds} milliseconds` which is the wanted format
  return prettyMilliseconds(-ms, { verbose: true }).replaceAll('-', '') as DurationString;
}
