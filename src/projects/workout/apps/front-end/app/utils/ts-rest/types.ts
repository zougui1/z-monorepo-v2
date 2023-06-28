import type zod from 'zod';

export type AnyZodObject = zod.AnyZodObject | zod.ZodOptional<zod.AnyZodObject> | zod.ZodDefault<zod.AnyZodObject>;

export type ZodOptionalInfer<T extends zod.ZodType | undefined> = T extends zod.ZodType ? zod.infer<T> : undefined;

export type AnyZodString = zod.ZodString | zod.ZodOptional<zod.ZodString> | zod.ZodDefault<zod.ZodString>;

export type ZodHeaders = zod.ZodObject<Record<string, AnyZodString>>;
