import { tryit } from 'radash';

import { Fap } from './database';
import { EnvType } from '../../EnvType';
import { FapContentType } from './FapContentType';

export class FapService {
  protected readonly query: Fap.Query;

  constructor(envType: EnvType) {
    this.query = envType === EnvType.Production ? Fap.Prod : Fap.Dev;
  }

  getUnfinishedFap = async (options?: GetUnfinishedFapOptions): Promise<Fap.Object | undefined> => {
    const [error, unfinishedFap] = await tryit(this.query.findUnfinishedFap)(options);

    if (error) {
      throw new Error('An error occured while trying to retrieve unfinished fap data', { cause: error });
    }

    return unfinishedFap;
  }

  findByMessageId = async (messageId: string): Promise<Fap.Object | undefined> => {
    return this.query.findByMessageId(messageId);
  }

  updateByMessageId = async (messageId: string, fap: { content: FapContentType }): Promise<void> => {
    await this.query.updateByMessageId(messageId, fap);
  }
}

export interface GetUnfinishedFapOptions {
  messageId?: string;
}
