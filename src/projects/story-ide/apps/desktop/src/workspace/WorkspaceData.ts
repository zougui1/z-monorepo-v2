import zod from 'zod';

export const workspaceDataSchema = zod.object({
  id: zod.string(),
  path: zod.string(),
  url: zod.string().url(),
  width: zod.number().int().positive(),
  height: zod.number().int().positive(),
  top: zod.number().int().positive(),
  left: zod.number().int().positive(),
  isMaximized: zod.boolean(),
  isMinimized: zod.boolean(),
  isFullscreen: zod.boolean(),

  state: zod.object({
    explorer: zod.object({
      directories: zod.record(zod.object({
        depth: zod.number(),
        nodes: zod.array(zod.object({
          name: zod.string(),
          path: zod.string(),
          type: zod.enum(['dir', 'file']),
        })),
      })),

      nodes: zod.record(zod.object({
        name: zod.string(),
        path: zod.string(),
        type: zod.enum(['dir', 'file']),
        depth: zod.number(),
      })),

      hoveredDirectoryPath: zod.string().optional(),
      selectedPaths: zod.array(zod.string()).transform<string[]>(() => []),
      openPaths: zod.array(zod.string()).transform<string[]>(() => []),
      loadingPaths: zod.array(zod.string()).transform<string[]>(() => []),
    }),
  }).optional(),
});

export type WorkspaceData = zod.infer<typeof workspaceDataSchema>;
