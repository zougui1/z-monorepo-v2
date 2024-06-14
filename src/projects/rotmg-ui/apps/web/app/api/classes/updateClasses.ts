import fs from 'fs-extra';
import { merge } from 'ts-deepmerge';
import type { PartialDeep, Paths } from 'type-fest';

import { getEnv } from '~/env';
import { getFlatErrorMessages } from '~/utils/zod';

import { classesSchema, type Classes } from './schema';
import { getClasses } from './getClasses';

export const updateClasses = async (partialData: PartialDeep<Classes>): Promise<Classes | ErrorResponse> => {
  const currentData = await getClasses();
  const data = classesSchema.safeParse(merge(currentData, partialData));

  if (!data.success) {
    const errors = getFlatErrorMessages(data.error);
    return { errors } as ErrorResponse;
  }

  await fs.writeJson(getEnv().classesFilePath, data.data, { spaces: 2 });
  return data.data;
}

export interface ErrorResponse {
  errors: {
    [key in Paths<Classes>]?: string;
  };
}
