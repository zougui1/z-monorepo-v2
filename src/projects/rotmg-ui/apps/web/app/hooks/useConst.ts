import { useRef } from 'react';

export const useConst = <T>(value: T | (() => T)): T => {
  const ref = useRef<T>();

  if (!ref.current) {
    ref.current = typeof value === 'function' ? (value as () => T)() : value;
  }

  return ref.current;
}
