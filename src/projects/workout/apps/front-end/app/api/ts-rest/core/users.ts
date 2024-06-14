import zod from 'zod';

import { router, contract } from '@zougui/common.ts-rest.core';

export const users = router('users', {
  contracts: {
    getMany: contract.get('/', {
      query: zod.object({
        skip: zod.coerce.number().default(0),
        limit: zod.coerce.number().default(3),
      }).default({}),

      response: zod.array(zod.object({
        name: zod.string(),
      })),
    }),
  },
});
