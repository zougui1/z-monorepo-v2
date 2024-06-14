import { useMemo } from 'react';
/**
 * Credit to material-ui for this snippet
 */

function setRef<T>(ref: React.Ref<T> | undefined | null, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export const useForkRef = <T>(
  refA: React.Ref<T> | undefined | null,
  refB: React.Ref<T> | undefined | null
): React.RefCallback<T> | null => {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return useMemo(() => {
    if (!refA && !refB) {
      return null;
    }

    return (refValue: T) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
