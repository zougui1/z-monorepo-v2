import { sort } from 'radash';
import Emittery from 'emittery';

import { Team } from './Team';
import type { FightEventMap } from './FightEventMap';
import { Entity } from '../entity';
import type { Game } from '../Game';
import type { GameMenuOption } from '../types';

export class Fight extends Emittery<FightEventMap> {
  readonly playerTeam: Team;
  readonly enemyTeam: Team;
  #isOver = false;
  #turns: Entity[] = [];
  #game: Game;
  currentEntity: Entity | undefined;

  constructor(game: Game, playerEntities: Entity[], enemyEntities: Entity[]) {
    super();

    this.#game = game;
    this.playerTeam = new Team(playerEntities);
    this.enemyTeam = new Team(enemyEntities);
  }

  play = (): void => {
    if (this.#isOver) {
      console.log('fight is over')
      return;
    }

    if (!this.playerTeam.isAlive()) {
      console.log('player team dead')
      this.#game.setMenu(undefined);
      this.emit('finish', { win: false });
      this.#isOver = true;
      return;
    }

    if (!this.enemyTeam.isAlive()) {
      console.log('enemy team dead')
      this.#game.setMenu(undefined);
      this.emit('finish', { win: true });
      this.#isOver = true;
      return;
    }

    if (!this.#turns.length) {
      this.prepareTurns();
      console.log('turns:', this.#turns.map(e => e.name).join(', '))
    }

    this.playTurn();
  }

  private playTurn = (): void => {
    const entity = this.#turns.shift();

    if (!entity) {
      return;
    }

    this.currentEntity = entity;

    if (entity.id.length < 10) {
      setTimeout(() => {
        const target = this.playerTeam.getAliveEntities()[0];
        console.log(`${entity.name} attacks ${target.name}`);
        entity.attack(target);
        this.emit('stateChange');
        this.play();
      }, 1000);
      return;
    }

    const options: GameMenuOption[] = [];

    options.push({
      text: 'Attack',
      action: () => {
        this.#game.setMenu(undefined);
        const target = this.enemyTeam.getAliveEntities()[0];
        console.log(`${entity.name} attacks ${target.name}`);
        entity.attack(target);
        this.emit('stateChange');
        this.play();
      },
    });
    /*options.push({
      text: 'Items',
      action: () => {
        console.log(`${entity.name}: items`);
        this.play();
      },
    });
    options.push({
      text: 'Defend',
      action: () => {
        console.log(`${entity.name}: defend`);
        this.play();
      },
    });*/

    this.#game.setMenu({ options });
  }

  private prepareTurns = (): void => {
    const entities = [
      ...this.playerTeam.getAliveEntities(),
      ...this.enemyTeam.getAliveEntities(),
    ];

    this.#turns = sort(entities, entity => entity.stats.get('agility'), true);
  }
}
