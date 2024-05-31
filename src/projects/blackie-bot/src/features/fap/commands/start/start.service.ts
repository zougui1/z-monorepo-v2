import { tryit } from 'radash';
import { DateTime } from 'luxon';

import { FapService } from '../../fap.service';
import { FapContentType } from '../../FapContentType';

export class StartService extends FapService {
  createFap = async (options: CreateFapOptions): Promise<void> => {
    const [error] = await tryit(this.query.create)({
      ...options,
      startDate: options.date,
    });

    if (error) {
      throw new Error('An error occured while trying to save the entry', { cause: error });
    }
  }
}

export interface CreateFapOptions {
  date: DateTime;
  content: FapContentType;
  messageId: string;
}
