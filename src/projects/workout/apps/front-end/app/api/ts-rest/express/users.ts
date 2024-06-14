import { handleRouter } from '@zougui/common.ts-rest.express';

import { api } from '../core';

const wait = (timeout: number): Promise<void> => new Promise(r => setTimeout(r, timeout));

export const users = handleRouter(api.routers.users, {
  contracts: {
    getMany: async data => {
      await wait(2000);

      return {
        status: 200,
        body: [
          { name: 'Zougui' },
          { name: 'Darxxie' },
          { name: 'Goodwarf' },
          { name: 'Wonder' },
          { name: 'Zoldiav' },
          { name: 'Nalvados' },
          { name: 'Elrodin' },
        ].slice(data.query.skip, data.query.limit),
      };
    },
  },
});
