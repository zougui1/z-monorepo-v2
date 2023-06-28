import { isNumber } from 'radash';

export const getConstraintValue = (constraint: number | undefined, original: number | undefined, defaultValue: number): number => {
  const res = isNumber(constraint)
    ? constraint
    : defaultValue;

  if (isNumber(original) && original < res) {
    return original;
  }

  return res;
}
