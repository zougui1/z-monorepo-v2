import fs from 'fs-extra';
import type zod from 'zod';

export const readJson = async <T extends zod.ZodSchema>(file: string, schema: T): Promise<zod.infer<T>> => {
  const data = await fs.readJson(file);
  return schema.parse(data);
}
