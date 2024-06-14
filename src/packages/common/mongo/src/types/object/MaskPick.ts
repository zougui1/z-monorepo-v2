import type { AnyObject } from '@zougui/common.type-utils'

import type { MaskExtract } from './MaskExtract';

export type MaskPick<T extends AnyObject, Mask extends Partial<Record<keyof T, boolean>>> = Pick<T, MaskExtract<Mask>>;
