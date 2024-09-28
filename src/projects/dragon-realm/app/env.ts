import envVar from 'env-var';

export const env = {
  configFile: envVar.get('CONFIG_FILE').required().asString(),
};
