import { ExitData } from '~/game';
import { AreaModel, type Area, type AreaObject, Exit, Location } from './AreaModel';
import { BuildingData } from '~/game/building';
import { VillagerData } from '~/game/villager';
export class AreaQuery {
  create = async (area: Area): Promise<AreaObject> => {
    const document = await AreaModel.create(area);
    return document.toObject();
  }

  findAll = async (): Promise<MinimalAreaObject[]> => {
    const documents = await AreaModel.find({}, {
      id: 1,
      name: 1,
      'exits.emptyObject': 1,
      'locations.emptyObject': 1,
    });
    return documents.map(document => document.toObject());
  }

  findByObjectId = async (id: string): Promise<AreaObject | undefined> => {
    const document = await AreaModel.findById(id);
    return document?.toObject();
  }

  findById = async (id: string): Promise<AreaObject | undefined> => {
    const document = await AreaModel.findOne({ id });
    return document?.toObject();
  }

  findLocationById = async (id: string): Promise<Location | undefined> => {
    const [document] = await AreaModel
      .aggregate<Location>()
      .match({ 'locations.id': id })
      .unwind('$locations')
      .match({ 'locations.id': id })
      .replaceRoot('$locations');

    return document;
  }

  findExitById = async (id: string): Promise<Exit | undefined> => {
    const [document] = await AreaModel
      .aggregate<Exit>()
      .match({ 'exits.id': id })
      .unwind('$exits')
      .match({ 'exits.id': id })
      .replaceRoot('$exits');

    return document;
  }

  findBuildingById = async (id: string): Promise<BuildingData | undefined> => {
    const [document] = await AreaModel
      .aggregate<BuildingData>()
      .match({ 'locations.buildings.id': id })
      .unwind('$locations')
      .unwind('$locations.buildings')
      .match({ 'locations.buildings.id': id })
      .replaceRoot('$locations.buildings');

    return document;
  }

  findVillagerById = async (id: string): Promise<VillagerData | undefined> => {
    const [document] = await AreaModel
      .aggregate<VillagerData>()
      .match({
        $or: [
          { 'locations.buildings.villagers.id': id },
          { 'locations.villagers.id': id },
        ]
      })
      .unwind('$locations')
      .facet({
        fromBuilding: [
          {
            $unwind: '$locations.buildings',
          },
          {
            $unwind: '$locations.buildings.villagers',
          },
          {
            $match: {
              'locations.buildings.villagers.id': id,
            },
          },
          {
            $project: {
              villager: '$locations.buildings.villagers',
            },
          },
        ],
        fromLocation: [
          {
            $unwind: '$locations.villagers',
          },
          {
            $match: {
              'locations.villagers.id': id,
            },
          },
          {
            $project: {
              villager: '$locations.villagers',
            },
          },
        ],
      })
      .project({
        villagers: {
          $concatArrays: ['$fromBuilding.villager', '$fromLocation.villager'],
        }
      })
      .unwind('$villagers')
      .limit(1)
      .replaceRoot('$villagers');

    return document;
  }

  updateByObjectId = async (id: string, data: Area): Promise<void> => {
    await AreaModel.findByIdAndUpdate(id, data);
  }
}
export interface MinimalAreaObject extends Pick<AreaObject, '_id' | 'id' | 'name'> {
  exits: object[];
  locations: object[];
}
