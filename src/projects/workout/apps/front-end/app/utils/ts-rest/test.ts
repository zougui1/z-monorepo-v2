import zod from 'zod';

import { createClient } from './client';
import { router } from './router';
import { contract } from './contract';
import { Method } from './Method';

const rootRouter = router('api', {
  routers: {
    v1: router('v1', {
      contracts: {
        getVersion: contract.get('/', {})
      },

      routers: {
        users: router('users', {
          contracts: {
            getUser: contract.get(':id', {
              params: zod.object({
                id: zod.string(),
              }),
            }),

            getUsers: contract.get('/', {
              query: zod.object({
                name: zod.string()
              }).optional(),
            }),

            createUser: contract.post('/', {
              body: zod.object({
                email: zod.string()
              }),
              query: zod.object({
                id: zod.string()
              }),
            }),
          },
        }),

        version: router('versions', {
          contracts: {
            getVersion: contract.get('/', {}),
          },
        }),
      },
    }),
  },
});

console.log(rootRouter)

rootRouter.routers.v1.routers.users.contracts.createUser;
export const client = createClient(rootRouter);
const createUser = client.v1.users.createUser({
  body: { email: '' },
  query: { id: '4' },
});
const users = client.v1.users.getUsers({
  query: { name: 's' }
});
client.v1.users.getUsers({
  query: { name: 's' }
});
client.v1.users.getUsers({
  query: undefined
});
client.v1.users.getUsers({

});
client.v1.users.getUsers();
const user = client.v1.users.getUser({
  params: { id: '4' }
});


const getVersion = client.v1.getVersion();

const getUsers = {
  method: Method.Get,
  path: '/',
}
