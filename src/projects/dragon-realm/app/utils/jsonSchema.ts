import zod from 'zod';

const defaultMessage = 'Invalid JSON';

export const jsonSchema = <T extends zod.ZodSchema>(schema: T, message: string = defaultMessage) => {
  return zod
    .string()
    .transform((str, ctx) => {
      try {
        return JSON.parse(str);
      } catch (error) {
        ctx.addIssue({ code: 'custom', message });
        return zod.NEVER;
      }
    })
    .pipe(schema);
}
