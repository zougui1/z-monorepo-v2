const primitiveTypes: Type[] = ['bigint', 'boolean', 'number', 'string'];

export const getType = (value: unknown): Type => {
  const type = typeof value;

  if ((primitiveTypes as string[]).includes(type)) {
    return type as Type;
  }

  return Array.isArray(value) ? 'array' : 'object';
}

export type Type = 'bigint' | 'number' | 'boolean' | 'string' | 'array' | 'object';
