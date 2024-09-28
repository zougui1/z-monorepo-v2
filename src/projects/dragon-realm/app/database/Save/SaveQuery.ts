import { SaveModel, type Save, type SaveObject } from './SaveModel';

export class SaveQuery {
  create = async (save: Omit<Save, 'createdAt' | 'updatedAt'>): Promise<SaveObject> => {
    const document = await SaveModel.create(save);
    return document.toObject();
  }

  find = async (): Promise<SaveObject[]> => {
    const documents = await SaveModel.find().limit(10);
    return documents.map(document => document.toObject());
  }

  findById = async (id: string): Promise<SaveObject | undefined> => {
    const document = await SaveModel.findById(id);
    return document?.toObject();
  }
}
