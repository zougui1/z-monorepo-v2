import type { AnyObject } from '@zougui/common.type-utils'

import type { MaskExtract } from './MaskExtract';

export type MaskOmit<T extends AnyObject, Mask extends Partial<Record<keyof T, boolean>>> = Omit<T, MaskExtract<Mask>> extends infer O ? { [K in keyof O]: O[K] } : never;
