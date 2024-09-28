import { EntityStats, type EntityStatsData } from './EntityStats';

export class Entity {
  readonly id: string;
  readonly name: string;
  readonly picture: string;
  readonly stats: EntityStats;

  constructor(data: EntityData) {
    this.id = data.id;
    this.name = data.name;
    this.picture = data.picture;
    this.stats = new EntityStats(data);
  }

  isAlive = (): boolean => {
    return this.stats.get('hp') > 0;
  }

  attack = (target: Entity): void => {
    target.receiveDamage(this.stats.get('strength'));
  }

  receiveDamage = (incomingDamage: number): number => {
    return this.stats.decrement('hp', incomingDamage);
  }
}

export interface EntityData extends EntityStatsData {
  id: string;
  name: string;
  picture: string;
}
