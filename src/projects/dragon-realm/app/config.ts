import fs from 'fs-extra';
import zod from 'zod';
import { fromError } from 'zod-validation-error';

import { env } from './env';

const schema = zod.object({
  mongo: zod.object({
    uri: zod.string().url(),
  }),

  game: zod.object({
    dataDirectory: zod.string(),
  }),
});

const getConfig = (): Config => {
  const rawConfig = fs.readJsonSync(env.configFile);

  try {
    return schema.parse(rawConfig);
  } catch (error) {
    const validationError = fromError(error);
    console.error('Error config:', env.configFile);
    console.error(validationError.toString());
    process.exit(1);
  }
}

export const config = getConfig();

export type Config = zod.infer<typeof schema>;
