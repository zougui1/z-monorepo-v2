import { randomIndex } from './randomIndex';

export const randomItem = <T>(items: T[]): T => {
  const index = randomIndex(items);
  return items[index];
}
