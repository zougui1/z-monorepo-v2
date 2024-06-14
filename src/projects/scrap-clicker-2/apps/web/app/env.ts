import zod from 'zod';

let env: Env | undefined;

const schema = zod.object({
  VITE_RESOURCE_FILE_PATH: zod.string(),
});

export const getEnv = (): Env => {
  const envVar = schema.parse(import.meta.env);

  env ??= {
    resourceFilePath: envVar.VITE_RESOURCE_FILE_PATH,
  };

  return env;
}

export interface Env {
  resourceFilePath: string;
}
