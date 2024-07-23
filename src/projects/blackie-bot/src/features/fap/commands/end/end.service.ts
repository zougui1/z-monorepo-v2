import { tryit } from 'radash';
import { DateTime } from 'luxon';

import { MS } from '@zougui/common.ms';


import { FapService } from '../../fap.service';
import { Fap } from '../../database';
import { FapContentType } from '../../FapContentType';

export class EndService extends FapService {
  finishLastFap = async (options: FinishLastFapOptions): Promise<FinishLastFapResult> => {
    const unfinishedFap = await this.getUnfinishedFap(options);

    if (!unfinishedFap) {
      throw new Error('No unfinished fap found');
    }

    await this.finishFap(unfinishedFap, options);

    const startTimestamp = unfinishedFap.startDate.toMillis();
    const endTimestamp = options.endDate.toMillis();

    return {
      duration: MS.toString(endTimestamp - startTimestamp, { format: 'verbose' }),
      content: options.content || unfinishedFap.content,
    };
  }

  private finishFap = async (fap: Fap.Object, options: FinishLastFapOptions): Promise<void> => {
    const [error] = await tryit(this.query.finish)(fap._id, {
      endDate: options.endDate,
      content: options.content,
    });

    if (error) {
      throw new Error('An error occured while trying to update the fap entry', { cause: error });
    }
  }
}

export interface FinishLastFapOptions {
  endDate: DateTime;
  content?: FapContentType;
  messageId?: string;
}

export interface FinishLastFapResult {
  duration: string;
  content: string | undefined;
}
