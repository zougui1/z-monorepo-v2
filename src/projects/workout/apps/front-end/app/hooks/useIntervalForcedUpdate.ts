import { useState } from 'react';

import { useInterval } from './useInterval';

export const useIntervalForcedUpdate = (ms: number): void => {
  const [, forceUpdate] = useState({});

  useInterval(() => {
    forceUpdate({});
  }, ms);
}
