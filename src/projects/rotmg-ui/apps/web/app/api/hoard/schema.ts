import zod from 'zod';

export const itemDataSlotSchema = zod.object({
  slotted: zod.boolean(),
  enchanted: zod.boolean(),
  count: zod.number().optional(),
});

export const itemDataSchema = zod.object({
  slots: zod.array(itemDataSlotSchema.nullable()),
  completedAt: zod.string().nullable().optional(),
});

export const hoardSchema = zod.record(itemDataSchema);

export type Hoard = zod.infer<typeof hoardSchema>;
export type ItemData = zod.infer<typeof itemDataSchema>;
export type ItemDataSlot = zod.infer<typeof itemDataSlotSchema>;

export * from 'zod';
