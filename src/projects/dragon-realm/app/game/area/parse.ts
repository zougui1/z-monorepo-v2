import zod from 'zod';

import { locationSchema } from '../location/parse';

export const exitSchema = zod.object({
  _id: zod.string().optional(),
  id: zod.string(),
  name: zod.string(),
  position: zod.tuple([zod.number(), zod.number(), zod.number()]),
  characterPosition: zod.tuple([zod.number(), zod.number(), zod.number()]),
  direction: zod.enum(['vertical', 'horizontal']),
  size: zod.number().min(0),
});

export const areaSchema = zod.object({
  _id: zod.string().optional(),
  id: zod.string(),
  locations: zod.array(locationSchema).default([]),
  exits: zod.array(exitSchema),
  boundaryPoints: zod.array(zod.tuple([zod.number(), zod.number(), zod.number()])),
});

export type ExitData = zod.infer<typeof exitSchema>;
export type AreaData = zod.infer<typeof areaSchema>;

export const parse = (data: unknown): AreaData => {
  return areaSchema.parse(data);
}
