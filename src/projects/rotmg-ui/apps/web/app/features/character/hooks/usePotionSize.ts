import { useSearchParams } from '@remix-run/react';

import { PotionSize } from '../enums';

export const usePotionSize = (defaultValue: PotionSize = PotionSize.Auto): PotionSize => {
  const [searchParams] = useSearchParams();
  const potionSize = searchParams.get('potionSize') || defaultValue;

  return isPotionSize(potionSize) ? potionSize : defaultValue;
}

const isPotionSize = (value: unknown): value is PotionSize => {
  return Object.values(PotionSize as Record<string, unknown>).includes(value);
}
