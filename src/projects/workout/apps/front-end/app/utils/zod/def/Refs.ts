import type { ZodTypeDef } from 'zod';

export type Refs = {
  seen: Map<ZodTypeDef, Seen>;
  currentPath: string[];
  propertyPath: string[] | undefined;
};

export type Seen = {
  def: ZodTypeDef;
  path: string[];
};

export const getRefs = (): Refs => {
  return {
    currentPath: [],
    propertyPath: undefined,
    seen: new Map(),
  };
}
