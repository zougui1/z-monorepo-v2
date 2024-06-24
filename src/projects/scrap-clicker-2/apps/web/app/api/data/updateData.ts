import fs from 'fs-extra';
import type { PartialDeep, Paths } from 'type-fest';

import { getEnv } from '~/env';
import { getFlatErrorMessages } from '~/utils/zod';

import { dataSchema, type Data } from './schema';
import { getData } from './getData';

export const updateData = async (partialData: PartialDeep<Data>): Promise<Data | ErrorResponse> => {
  const currentData = await getData();
  const data = dataSchema.safeParse({
    ...currentData,
    ...partialData,
    resources: {
      ...currentData.resources,
      ...partialData?.resources,
    },
    achievements: {
      ...currentData.achievements,
      ...partialData?.achievements,
    },
  });

  if (!data.success) {
    const errors = getFlatErrorMessages(data.error);
    return { errors } as ErrorResponse;
  }

  await fs.writeJson(getEnv().resourceFilePath, data.data, { spaces: 2 });
  return data.data;
}

export interface ErrorResponse {
  errors: {
    [key in Paths<Data>]: string;
  };
}
