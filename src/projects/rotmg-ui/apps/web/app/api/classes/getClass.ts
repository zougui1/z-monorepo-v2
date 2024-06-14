import { getClasses } from './getClasses';
import type { Classes, Class } from './schema';

export const getClass = async ({ name }: GetClassOptions): Promise<Class | undefined> => {
  const classes = await getClasses();

  if (name in classes) {
    return classes[name as keyof Classes];
  }
}

export interface GetClassOptions {
  name: string;
}
