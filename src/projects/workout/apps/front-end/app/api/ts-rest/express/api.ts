import { handleRouter } from '@zougui/common.ts-rest.express';

import { users } from './users';
import { api } from '../core';

export const router = handleRouter(api, {
  contracts: {
    getVersion: () => {
      return {
        status: 200,
        body: { version: '0.1.0' },
      };
    },
  },

  routers: {
    users,
  },
});
