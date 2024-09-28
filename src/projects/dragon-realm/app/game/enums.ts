export enum Class {
  ScaledDragon = 'Scaled Dragon',
  FurredDragon = 'Furred Dragon',
  Wyvern = 'Wyvern',
  Hydra = 'Hydra',
  FireDragon = 'Fire Dragon',
  WaterDragon = 'Water Dragon',
  AirDragon = 'Air Dragon',
  StormDragon = 'Storm Dragon',
  IceDragon = 'Ice Dragon',
  LightDragon = 'Light Dragon',
  ShadowDragon = 'Shadow Dragon',
}

export const classList = Object.values(Class) as [Class, ...Class[]];

export enum StatName {
  Hp = 'hp',
  Mp = 'mp',
  Strength = 'strength',
  Sharpness = 'sharpness',
  Resilience = 'resilience',
  Agility = 'agility',
  Deftness = 'deftness',
  MagicalMight = 'magical Might',
  MagicalMending = 'magical Mending',
}
