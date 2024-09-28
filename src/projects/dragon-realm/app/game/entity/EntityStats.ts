import { clamp } from '@zougui/common.math-utils';

const minStatValue = 0;
const maxStatValue = 9999;

export class EntityStats {
  #data: EntityStatsData;

  constructor(data: EntityStatsData) {
    this.#data = data;
  }

  get = (stat: keyof EntityStatsData): number => {
    return this.#data[stat];
  }

  set = (stat: keyof EntityStatsData, value: number): number => {
    const max = this.getMaxStatValue(stat);
    return this.#data[stat] = clamp(value, minStatValue, max);
  }

  inccrement = (stat: keyof EntityStatsData, value: number): number => {
    return this.set(stat, this.get(stat) + value);
  }

  decrement = (stat: keyof EntityStatsData, value: number): number => {
    return this.set(stat, this.get(stat) - value);
  }

  private getMaxStatValue = (stat: keyof EntityStatsData): number => {
    if (stat === 'hp') return this.#data.maxHp;
    if (stat === 'mp') return this.#data.maxMp;

    return maxStatValue;
  }
}

export interface EntityStatsData {
  maxHp: number;
  hp: number;
  maxMp: number;
  mp: number;
  strength: number;
  sharpness: number;
  resilience: number;
  agility: number;
  deftness: number;
  magicalMight: number;
  magicalMending: number;
}
