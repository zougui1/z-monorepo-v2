import fs from 'fs-extra';
import zod from 'zod';
import { fromError } from 'zod-validation-error';
import { isNumber } from 'radash';

import { MS } from '@zougui/common.ms';

import { CONFIG_FILE } from './env';

const checkIsDirectory = async (filePath: string) => {
  const stats = await fs.stat(filePath);
  return stats.isDirectory();
}

const schema = zod.object({
  containers: zod.array(zod.object({
    dir: zod.string().refine(
      checkIsDirectory,
      filePath => ({ message: `The path "${filePath}" must be a directory` }),
    ),

    lifetime: zod
      .string()
      .refine(
        lifetime => MS.validate(lifetime),
        lifetime => ({ message: `"${lifetime}" is not a valid lifetime` }),
      )
      .transform(lifetime => MS.parse(lifetime))
      .refine(lifetime => {
        console.log(lifetime)
        // if lifetime is not a number, which can happen if the above refine
        // returns false, then we ignore this condition
        return !isNumber(lifetime) ? true : lifetime > 0
      }, 'The lifetime must be greated than 0'),
  })),
});

let config: Config | undefined;

export const getConfig = async (): Promise<Config> => {
  if (config) {
    return config;
  }

  const rawConfig = await fs.readJson(CONFIG_FILE);

  try {
    config = await schema.parseAsync(rawConfig);
  } catch (error) {
    const validationError = fromError(error);
    console.error(validationError.toString());
    process.exit(1);
  }

  return config;
}

export type Config = zod.infer<typeof schema>;
