import { parse, villagerSchema } from './parse';

export type * from './parse';

export const villager = {
  parse,
  schema: villagerSchema,
};
