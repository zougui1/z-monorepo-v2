import zod from 'zod';

import { ClassName, classes } from '~/data/classes';

const potionsRemainingSchema = zod.object({
  life: zod.number().int().min(0).max(99),
  mana: zod.number().int().min(0).max(99),
  attack: zod.number().int().min(0).max(99),
  defense: zod.number().int().min(0).max(99),
  speed: zod.number().int().min(0).max(99),
  dexterity: zod.number().int().min(0).max(99),
  vitality: zod.number().int().min(0).max(99),
  wisdom: zod.number().int().min(0).max(99),
});

const characterSchema = zod.object({
  id: zod.string(),
  className: zod.string().refine((value): value is ClassName => {
    return value in classes;
  }),
  isSeasonal: zod.boolean(),
  potionsRemaining: potionsRemainingSchema,
  label: zod.string().optional(),
  title: zod.string().optional(),
});

export const charactersSchema = zod.array(characterSchema);

export type Character = zod.infer<typeof characterSchema>;
export type PotionsRemaining = zod.infer<typeof potionsRemainingSchema>;

export * from 'zod';
