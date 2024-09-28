import { Entity } from '../entity';

export class Team {
  readonly entities: Entity[];

  constructor(entities: Entity[]) {
    this.entities = entities;
  }

  getAliveEntities = (): Entity[] => {
    return this.entities.filter(entity => entity.isAlive());
  }

  isAlive = (): boolean => {
    return this.getAliveEntities().length > 0;
  }
}
