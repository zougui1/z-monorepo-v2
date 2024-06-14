import { isEqual } from 'radash';
import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { usePrevious } from './usePrevious';

export const useDebugLifecycle = (label: string, props: Record<string, unknown>, options?: UseDebugLifecycleOptions): void => {
  const previousProps = usePrevious(props);
  const didMount = useRef(false);
  const updateCount = useRef(0);

  useIsomorphicLayoutEffect(() => {
    if(options?.disabled || !didMount.current) {
      return;
    }

    updateCount.current++;
    console.groupCollapsed(`${label}: update ${updateCount.current}`);

    for (const [name, value] of Object.entries(props)) {
      if (previousProps && value !== previousProps[name]) {
        console.groupCollapsed(`changed prop: ${name}`);
        console.log('previous value:', previousProps[name]);
        console.log('current value:', value);
        console.groupEnd();
      }
    }

    console.groupEnd();
  });

  useIsomorphicLayoutEffect(() => {
    if (options?.disabled) {
      return;
    }

    didMount.current = true;
    console.log(`${label}: mount`);

    return () => {
      console.log(`${label}: unmount`);
      updateCount.current = 0;
      didMount.current = false;
    }
  }, []);
}

export interface UseDebugLifecycleOptions {
  disabled?: boolean;
}
