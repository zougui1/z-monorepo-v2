import zod from 'zod';

/**
 * @deprecated
 */
export const itemDataSlotSchemaV1 = zod.object({
  slotted: zod.boolean(),
  enchanted: zod.boolean(),
  count: zod.number().optional(),
}).transform(data => ({
  count: data.count,
  enchants: (data.slotted || data.enchanted) ? 1 : 0,
}));

export const itemDataSlotSchemaV2 = zod.object({
  count: zod.number().optional(),
  enchants: zod.number().max(4),
});

export const itemDataSlotSchema = zod.union([
  itemDataSlotSchemaV1,
  itemDataSlotSchemaV2,
]);

export const itemDataSchema = zod.object({
  slots: zod.array(itemDataSlotSchema.nullable()),
  completedAt: zod.string().nullable().optional(),
});

export const hoardSchema = zod.record(itemDataSchema);

export type Hoard = zod.output<typeof hoardSchema>;
export type ItemData = zod.output<typeof itemDataSchema>;
export type ItemDataSlot = zod.output<typeof itemDataSlotSchema>;

export * from 'zod';
