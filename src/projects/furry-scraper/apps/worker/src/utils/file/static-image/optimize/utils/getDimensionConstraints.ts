import { getConstraintValue } from './getConstraintValue';

export const getDimensionConstraints = (options: GetDimensionConstraintsOptions): [min: number, max: number] => {
  const min = getConstraintValue(
    options.min,
    options.original,
    0,
  );
  const max = getConstraintValue(
    options.max,
    options.original,
    Number.MAX_SAFE_INTEGER,
  );

  return [min, max];
}

export interface GetDimensionConstraintsOptions {
  min?: number | undefined;
  max?: number | undefined;
  original?: number | undefined;
}
