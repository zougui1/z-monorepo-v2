import zod from 'zod';

import { parsePathPattern } from '../../parsePathPattern';

const getAnyParamType = (): zod.ZodUnion<[zod.ZodNumber, zod.ZodString]> => {
  return zod.union([zod.number(), zod.string()]);
}

export const createPathParamsSchema = (pathPattern: string | void, pathSchema: zod.AnyZodObject | void): zod.AnyZodObject => {
  if (pathSchema) {
    return pathSchema;
  }

  if (!pathPattern) {
    return zod.object({});
  }

  const shape = parsePathPattern(pathPattern).reduce((acc, pathComponent) => {
    if (pathComponent.isDynamic) {
      const paramSchema = getAnyParamType();

      acc[pathComponent.name] = pathComponent.isOptional
        ? paramSchema.optional()
        : paramSchema;
    }

    return acc;
  }, {} as zod.ZodRawShape);

  return zod.object(shape);
}
