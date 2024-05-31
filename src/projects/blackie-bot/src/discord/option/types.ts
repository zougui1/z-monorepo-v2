import z from 'zod';

import type { Option } from './Option';

export type AnyOption = Option<string, z.Schema>;
export type InferOptionsObject<T extends Record<string, Option>> = z.infer<z.ZodObject<{
  [K in keyof T]: T[K]['schema'];
}>>;
