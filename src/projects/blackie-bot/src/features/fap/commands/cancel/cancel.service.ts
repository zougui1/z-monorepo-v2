import { tryit } from 'radash';
import { DateTime } from 'luxon';

import { MS } from '@zougui/common.ms';

import { FapService } from '../../fap.service';

export class CancelService extends FapService {
  deleteLastFap = async (options: DeleteLastFapOptions): Promise<DeleteLastFapResult> => {
    const unfinishedFap = await this.getUnfinishedFap();

    if (!unfinishedFap) {
      throw new Error('No unfinished fap found');
    }

    const [error] = await tryit(this.query.deleteById)(unfinishedFap._id);

    if (error) {
      throw new Error('An error occured while trying to update the fap entry', { cause: error });
    }

    const startTimestamp = unfinishedFap.startDate.toMillis();
    const endTimestamp = options.date.toMillis();

    return {
      duration: MS.toString(endTimestamp - startTimestamp, { format: 'long' }),
      content: unfinishedFap.content,
    };
  }
}

export interface DeleteLastFapOptions {
  date: DateTime;
}

export interface DeleteLastFapResult {
  duration: string;
  content: string | undefined;
}
