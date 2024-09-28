import { connect } from './connect';
//import { CharacterQuery } from './Character';
import { SaveQuery } from './Save';
import { AreaQuery } from './Area';

connect();

export const DB = {
  //character: new CharacterQuery(),
  save: new SaveQuery(),
  area: new AreaQuery(),
};
