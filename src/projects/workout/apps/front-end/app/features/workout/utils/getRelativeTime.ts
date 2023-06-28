import { DateTime } from 'luxon';

import { MS } from '@zougui/common.ms';

const seconds = 60;
const milliseconds = 1000;

export const getRelativeTime = (start: DateTime): string => {
  const now = DateTime.now();
  const duration = now.toMillis() - start.toMillis();
  // remove seconds and milliseconds from the result
  const roundedDuration = Math.round(duration / milliseconds / seconds) * seconds * milliseconds;

  return MS.toString(roundedDuration, { format: 'verbose' });
}
