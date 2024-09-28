import zod from 'zod';

export enum DialogType {
  Text = 'text',
}

const dialogTextSchema = zod.object({
  type: zod.literal(DialogType.Text),
  text: zod.string(),
});

//const dialogSchema = zod.union([dialogTextSchema]);

export const villagerSchema = zod.object({
  _id: zod.string().optional(),
  id: zod.string(),
  name: zod.string(),
  dialog: dialogTextSchema
});

export type VillagerDialogTextData = zod.infer<typeof dialogTextSchema>;
export type VillagerDialogData = VillagerDialogTextData;
export type VillagerData = zod.infer<typeof villagerSchema>;

export const parse = (data: unknown): VillagerData => {
  return villagerSchema.parse(data);
}
