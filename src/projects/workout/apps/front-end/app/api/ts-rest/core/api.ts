import zod from 'zod';

import { router, contract } from '@zougui/common.ts-rest.core';

import { users } from './users';

export const api = router('api', {
  contracts: {
    getVersion: contract.get('version', {
      response: zod.object({
        version: zod.string(),
      }),
    }),
  },

  routers: {
    users,
  },
});
