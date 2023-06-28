import { useRef } from 'react'

export const useUpToDateRef = <T>(value: T): React.MutableRefObject<T> => {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}
