import { useIntervalForcedUpdate } from '~/hooks';

import { useStartDate } from '../../hooks';
import { getRelativeTime } from '../../utils';

const refreshInterval = 1000 * 10;

export const RelativeStartTime = () => {
  const startDate = useStartDate();
  useIntervalForcedUpdate(refreshInterval);

  return (
    <>
      Started {getRelativeTime(startDate)} ago
    </>
  );
}
