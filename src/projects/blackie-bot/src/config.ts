import fs from 'fs-extra';
import zod from 'zod';
import { fromError } from 'zod-validation-error';

import { env } from './env';

const schema = zod.object({
  discord: zod.object({
    authorizedUserIds: zod.array(zod.string()),
    channelIds: zod.array(zod.string()),
  }),

  mongo: zod.object({
    uri: zod.string().url(),
  }),

  socket: zod.object({
    port: zod.number().positive().int(),
    domain: zod.string().url(),
  }),
});

const readConfig = (configPath: string): PartialConfig => {
  const rawConfig = fs.readJsonSync(configPath);

  try {
    return schema.parse(rawConfig);
  } catch (error) {
    const validationError = fromError(error);
    console.error('Error config:', configPath);
    console.error(validationError.toString());
    process.exit(1);
  }
}

const getConfig = (): Config => {
  return {
    production: readConfig(env.configFile.production),
    development: readConfig(env.configFile.development),
  };
}

export const config = getConfig();

export type PartialConfig = zod.infer<typeof schema>;
export type Config = {
  production: PartialConfig;
  development: PartialConfig;
};
