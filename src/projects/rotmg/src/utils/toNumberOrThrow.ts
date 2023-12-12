import { isNumber } from 'radash';

const defaultErrorMessage = 'invalid number';

export const toNumberOrThrow = (value: string, errorMessage?: string | undefined): number => {
  const dirtyNumber = Number(value);

  if (!isNumber(dirtyNumber)) {
    throw new Error(errorMessage || defaultErrorMessage);
  }

  return dirtyNumber;
}
