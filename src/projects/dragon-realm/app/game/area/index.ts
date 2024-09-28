import { parse, areaSchema, type AreaData } from './parse';
import { getData } from './getData';

export type * from './parse';

export const area = {
  parse,
  schema: areaSchema,

  findById: async (id: string): Promise<AreaData | undefined> => {
    const areas = await getData();
    console.log('areas', areas.length)
    return areas.find(area => area.id === id);
  },
};
