import { parse, locationSchema, LocationData } from './parse';
import { getData } from './getData';

export * from './GameInLocation';
export type * from './parse';

export const location = {
  parse,
  getData,
  schema: locationSchema,

  findByName: async (name: string): Promise<LocationData | undefined> => {
    const locations = await getData();
    return locations.find(location => location.name === name);
  },
};
