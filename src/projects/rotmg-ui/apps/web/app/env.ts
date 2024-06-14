import zod from 'zod';

let env: Env | undefined;

const schema = zod.object({
  VITE_CLASSES_FILE_PATH: zod.string(),
  VITE_CHARACTERS_FILE_PATH: zod.string(),
  VITE_HOARD_FILE_PATH: zod.string(),
});

export const getEnv = (): Env => {
  const envVar = schema.parse(import.meta.env);

  env ??= {
    classesFilePath: envVar.VITE_CLASSES_FILE_PATH,
    charactersFilePath: envVar.VITE_CHARACTERS_FILE_PATH,
    hoardFilePath: envVar.VITE_HOARD_FILE_PATH,
  };

  return env;
}

export interface Env {
  classesFilePath: string;
  charactersFilePath: string;
  hoardFilePath: string;
}
