export type MaskExtract<Mask extends Partial<Record<string, boolean>>> = ExtractKey<Mask, keyof Mask & string>;
type ExtractKey<T extends object, K extends keyof T & string> = K extends keyof T ? T[K] extends true ? K : never : never;
