import fs from 'fs-extra';

import { getEnv } from '~/env';

import { hoardSchema, type Hoard } from '../schema';

export const updateHoard = async (hoard: Hoard): Promise<void> => {
  const data = hoardSchema.safeParse(hoard);

  if (!data.success) {
    return;
  }

  await fs.writeJson(getEnv().hoardFilePath, data.data, { spaces: 2 });
}
