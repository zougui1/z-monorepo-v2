import zod from 'zod';

import { buildingSchema } from '../building/parse';
import { villagerSchema } from '../villager/parse';


export const locationSchema = zod.object({
  _id: zod.string().optional(),
  id: zod.string().min(3),
  name: zod.string().min(3),
  position: zod.tuple([zod.number(), zod.number(), zod.number()]),
  buildings: zod.array(buildingSchema).default([]),
  villagers: zod.array(villagerSchema).default([]),
});

export type LocationData = zod.infer<typeof locationSchema>;

export const parse = (data: unknown): LocationData => {
  return locationSchema.parse(data);
}
