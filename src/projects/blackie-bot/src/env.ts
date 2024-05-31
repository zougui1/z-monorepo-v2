import path from 'node:path';

import { config } from 'dotenv';
import envVar from 'env-var';

config({
  path: path.join(__dirname, '../.env'),
});

export const env = {
  nodeEnv: envVar.get('NODE_ENV').default('development').asString(),

  configFile: {
    production: envVar.get('CONFIG_FILE.PRODUCTION').required().asString(),
    development: envVar.get('CONFIG_FILE.DEVELOPMENT').required().asString(),
  },

  discord: {
    token: envVar.get('DISCORD.TOKEN').required().asString(),
    clientId: envVar.get('DISCORD.CLIENT_ID').required().asString(),
  },

  notion: {
    token: envVar.get('NOTION.TOKEN').required().asString(),
  },
};
