import { parse, buildingSchema } from './parse';

export type * from './parse';

export const building = {
  parse,
  schema: buildingSchema,
};
