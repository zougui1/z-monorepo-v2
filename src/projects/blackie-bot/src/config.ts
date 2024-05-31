import fs from 'fs-extra';
import zod from 'zod';
import { fromError } from 'zod-validation-error';

import { env } from './env';

const mongoSchema = zod.object({
  uri: zod.string(),
});

const discordSchema = zod.object({
  channelIds: zod.array(zod.string()),
});

const schema = zod.object({
  discord: zod.object({
    authorizedUserIds: zod.array(zod.string()),

    production: discordSchema,
    test: discordSchema,
  }),

  mongo: zod.object({
    production: mongoSchema,
    test: mongoSchema,
  }),
});

const getConfig = (): Config => {
  const rawConfig = fs.readJsonSync(env.configFile);

  try {
    return schema.parse(rawConfig);
  } catch (error) {
    const validationError = fromError(error);
    console.error(validationError.toString());
    process.exit(1);
  }
}

export const config = getConfig();

type Config = zod.infer<typeof schema>;
