import { getLocationMenu } from './getLocationMenu';
import type { LocationData } from './parse';
import type { Game } from '../Game';

export class GameInLocation {
  readonly #game: Game;

  constructor(game: Game) {
    this.#game = game;
  }

  play = (location: LocationData): void => {
    const menu = getLocationMenu(location, {
      onEnterBuilding: building => {
        this.#game.enterBuilding(building);
        this.#game.removeMenu();
        this.#game.play();
      },

      onTalk: this.#game.talkTo,

      onLeave: () => {
        this.#game.leaveLocation();
        this.#game.play();
      },
    });

    this.#game.setMenu(menu);
  }
}
