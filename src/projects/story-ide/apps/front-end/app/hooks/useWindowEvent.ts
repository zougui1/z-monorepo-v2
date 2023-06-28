import { useEffect } from 'react';

export const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (e: WindowEventMap[K]) => void,
  depenencies: React.DependencyList = [],
) => {
  useEffect(() => {
    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, ...depenencies]);
}
