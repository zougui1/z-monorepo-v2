import { connections } from '../../database';

export class ClearService {
  protected readonly connection = connections.development;

  clear = async (): Promise<void> => {
    await this.connection.dropDatabase();
  }
}
