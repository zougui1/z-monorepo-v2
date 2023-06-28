import { clamp, getIsInRange } from '@zougui/common.math-utils';

export class Bound {
  #min: number;
  #max: number;

  constructor(min: number, max: number) {
    this.#min = min;
    this.#max = max;
  }

  clamp(value: number): number {
    return clamp(value, this.#min, this.#max);
  }

  getIsInRange(value: number): boolean {
    return getIsInRange(value, this.#min, this.#max);
  }
}
