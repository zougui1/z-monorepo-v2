import zod from 'zod';

import { router } from './router';
import { contract } from '../contract';
import { Method } from '../Method';

describe('router', () => {
  describe('with no sub-routers and contracts', () => {
    it('should return an empty router with the specified path', () => {
      const data = router('users', {});

      expect(data).toEqual({
        path: 'users',
        contracts: {},
        routers: {},
      });
    });
  });

  describe('with contracts but no sub-routers', () => {
    it('should return a router with the specified path and contracts', () => {
      const data = router('users', {
        contracts: {
          getMany: contract.get('/', {
            query: zod.object({
              page: zod.number().default(1),
            }).default({}),
          }),

          getOne: contract.get(':id', {
            params: zod.object({
              id: zod.string(),
            }),
          }),
        },
      });

      expect(data).toEqual({
        path: 'users',
        contracts: {
          getMany: {
            path: '/',
            method: Method.Get,
            query: expect.any(zod.ZodDefault),
          },

          getOne: {
            path: ':id',
            method: Method.Get,
            params: expect.any(zod.ZodObject),
          },
        },
        routers: {},
      });
    });
  });

  describe('with sub-routers but no contracts', () => {
    it('should return a router with the specified path and sub-routers', () => {
      const data = router('users', {
        routers: {
          stats: router('stats', {}),
        },
      });

      expect(data).toEqual({
        path: 'users',
        contracts: {},
        routers: {
          stats: {
            path: 'stats',
            contracts: {},
            routers: {},
          }
        },
      });
    });
  });

  describe('with sub-routers and contracts', () => {
    it('should return the router with the specified path, sub-routers and contracts', () => {
      const data = router('users', {
        contracts: {
          getMany: contract.get('/', {
            query: zod.object({
              page: zod.number().default(1),
            }).default({}),
          }),

          getOne: contract.get(':id', {
            params: zod.object({
              id: zod.string(),
            }),
          }),
        },

        routers: {
          stats: router('stats', {}),
        },
      });

      expect(data).toEqual({
        path: 'users',
        contracts: {
          getMany: {
            path: '/',
            method: Method.Get,
            query: expect.any(zod.ZodDefault),
          },

          getOne: {
            path: ':id',
            method: Method.Get,
            params: expect.any(zod.ZodObject),
          },
        },

        routers: {
          stats: {
            path: 'stats',
            contracts: {},
            routers: {},
          }
        },
      });
    });
  });
});
