import { useEffect } from 'react';

import { useUpToDateRef } from './useUpToDateRef';

export const useInterval = (func: () => void, ms: number): void => {
  const funcRef = useUpToDateRef(func);

  useEffect(() => {
    const interval = setInterval(
      () => funcRef.current(),
      ms,
    );

    return () => {
      clearInterval(interval);
    }
  }, [ms, funcRef]);
}
