import { getBuildingMenu } from './getBuildingMenu';
import type { BuildingData } from './parse';
import type { Game } from '../Game';

export class GameInBuilding {
  readonly #game: Game;

  constructor(game: Game) {
    this.#game = game;
  }

  play = (building: BuildingData): void => {
    const menu = getBuildingMenu(building, {
      onTalk: this.#game.talkTo,

      onLeave: () => {
        this.#game.leaveBuilding();
        this.#game.play();
      },
    });

    this.#game.setMenu(menu);
  }
}
