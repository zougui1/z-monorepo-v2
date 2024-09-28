import zod from 'zod';

import { villagerSchema } from '../villager/parse';


export const buildingSchema = zod.object({
  _id: zod.string().optional(),
  id: zod.string(),
  name: zod.string(),
  villagers: zod.array(villagerSchema).default([]),
});

export type BuildingData = zod.infer<typeof buildingSchema>;

export const parse = (data: unknown): BuildingData => {
  return buildingSchema.parse(data);
}
