import Emittery from 'emittery';

import type { CharacterData } from '~/types/CharacterData';

import { GameInLocation } from './location/GameInLocation';
import type { LocationData } from './location';
import type { BuildingData } from './building';
import type { AreaData } from './area';
import { GameInBuilding } from './building/GameInBuilding';
import type { GameEventMap } from './GameEventMap';
import type { GameDialogData, GameMenu } from './types';
import { VillagerData } from './villager';
import { Fight } from './fight';
import { Entity } from './entity';
import { VectorArray } from '~/types';

export class Game extends Emittery<GameEventMap> {
  readonly _id: string;
  readonly characters: CharacterData[];
  currentArea: AreaData;
  currentLocation: LocationData | undefined;
  currentBuilding: BuildingData | undefined;
  #gameInLocation = new GameInLocation(this);
  #gameInBuilding = new GameInBuilding(this);
  currentMenu: GameMenu | undefined;
  currentDialog: GameDialogData | undefined;
  currentFight: Fight | undefined;
  x = 1;
  y = 1;
  z = 1;

  constructor(data: GameData) {
    super();

    this._id = data._id;
    this.characters = data.characters;
    this.currentArea = data.currentArea;
    this.currentLocation = data.currentLocation;
    this.currentBuilding = data.currentBuilding;
  }

  play = (): void => {
    console.log('play');

    if (this.currentFight) {
      return this.currentFight.play();
    }

    if (this.currentBuilding) {
      return this.#gameInBuilding.play(this.currentBuilding);
    }

    if (this.currentLocation) {
      return this.#gameInLocation.play(this.currentLocation);
    }
  }

  startFight = (): void => {
    this.currentFight = new Fight(
      this,
      this.characters.map(character => new Entity({ ...character, id: character._id })),
      [new Entity({
        id: 'slime',
        name: 'Slime',
        picture: 'https://picsum.photos/seed/11121211212121/200/200',
        maxHp: 20,
        hp: 20,
        maxMp: 20,
        mp: 20,
        strength: 8,
        sharpness: 5,
        resilience: 5,
        agility: 5,
        deftness: 5,
        magicalMight: 5,
        magicalMending: 5,
      })]
    );
    this.emit('stateChange');
    this.play();
  }

  changeArea = (area: AreaData, [x, y]: VectorArray): void => {
    this.x = x;
    this.y = y;
    this.currentArea = area;

    this.emit('stateChange');
    this.emit('positionChange', [this.x, this.y, this.z]);
  }

  finishFight = (): void => {
    for (const entity of this.currentFight?.playerTeam.entities || []) {
      for (const character of this.characters) {
        if (entity.name === character.name) {
          character.hp = entity.stats.get('hp');
        }
      }
    }
    this.currentFight = undefined;
    this.emit('stateChange');
    this.play();
  }

  enterLocation = (location: LocationData): void => {
    console.log('enterLocation')
    this.currentLocation = location;
    this.emit('stateChange');
    this.play();
  }

  enterBuilding = (building: BuildingData): void => {
    console.log('enterBuilding')
    this.currentBuilding = building;
    this.emit('stateChange');
  }

  leaveLocation = (): void => {
    if (this.currentLocation) {
      const [locationX, locationY] = this.currentLocation.position;

      this.x = locationX;
      this.y = locationY - 1;
    }

    this.leaveBuilding();
    this.currentLocation = undefined;
    this.emit('stateChange');
  }

  leaveBuilding = (): void => {
    this.currentBuilding = undefined;
    this.emit('stateChange');
  }

  removeMenu = (): void => {
    this.emit('menu', undefined);
  }

  setMenu = (menu: GameMenu | undefined): void => {
    this.currentMenu = menu;
    this.emit('menu', menu);
  }

  talkTo = (villager: VillagerData): void => {
    // remove the menu when talking
    this.setMenu(undefined);

    this.currentDialog = {
      ...villager.dialog,
      villager,
    };
    this.emit('dialog', this.currentDialog);
  }

  finishDialog = (): void => {
    this.currentDialog = undefined;
    this.emit('dialog', undefined);
    this.play();
  }
}

export interface GameData {
  _id: string;
  characters: CharacterData[];
  currentArea: AreaData;
  currentLocation?: LocationData;
  currentBuilding?: BuildingData;
}
