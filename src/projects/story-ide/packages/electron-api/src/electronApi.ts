import zod from 'zod';

export const electronApi = {
  fs: {
    index: {
      fullPath: '/fs',

      params: zod.object({
        path: zod.string(),
      }),

      response: zod.array(zod.object({
        path: zod.string(),
        name: zod.string(),
        type: zod.enum(['dir', 'file']),
      })),
    },

    file: {
      fullPath: '/fs/file',

      params: zod.object({
        path: zod.string(),
      }),

      response: zod.string(),
    },

    delete: {
      fullPath: '/fs/delete',

      params: zod.object({
        paths: zod.array(zod.string()),
      }),

      response: zod.object({}),
    },

    rename: {
      fullPath: '/fs/rename',

      params: zod.object({
        oldPath: zod.string(),
        newPath: zod.string(),
      }),

      response: zod.object({}),
    },
  },


  state: {
    get: {
      fullPath: '/state',

      params: zod.object({}).optional(),

      // TODO validate the state
      response: zod.object({}).passthrough(),
    },
  },
};
