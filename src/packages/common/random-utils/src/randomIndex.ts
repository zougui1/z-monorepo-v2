import { randomInteger } from './randomInteger';

export const randomIndex = (array: unknown[]): number => {
  return randomInteger(0, array.length);
}
