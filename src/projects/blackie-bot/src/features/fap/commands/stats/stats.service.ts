import { sum, sort } from 'radash';

import { MS } from '@zougui/common.ms';

import { FapService } from '../../fap.service';
import { FapContentType } from '../../FapContentType';
import { DateTime } from 'luxon';

const formatDuration = (milliseconds: number): string => {
  // removes seconds from the results
  const roundedMilliseconds = Math.round(milliseconds / 60_000) * 60_000;
  return MS.toString(roundedMilliseconds, { format: 'verbose' });
}

export class StatsService extends FapService {
  getStats = async (options?: GetStatsOptions) => {
    console.time('query')
    const stats = await this.query.findStats(options);
    console.timeEnd('query')

    // if there is no filter on the contents then compute the total
    if (!options?.contents?.length) {
      stats.unshift({
        content: 'Total' as FapContentType,
        count: sum(stats, stat => stat.count),
        startDate: new Date(Math.min(...stats.map(stat => stat.startDate.getTime()))),
        durations: {
          total: sum(stats, stat => stat.durations.total),
          shortest: Math.min(...stats.map(stat => stat.durations.shortest)),
          longest: Math.max(...stats.map(stat => stat.durations.longest)),
          average: sum(stats, stat => stat.durations.average) / stats.length,
        },
      });
    }

    return sort(stats, stat => stat.count, true).map(stat => {
      return {
        content: stat.content,
        count: stat.count,
        startDate: DateTime.fromJSDate(stat.startDate).toLocaleString(DateTime.DATE_FULL),
        durations: {
          total: formatDuration(stat.durations.total),
          shortest: formatDuration(stat.durations.shortest),
          longest: formatDuration(stat.durations.longest),
          average: formatDuration(stat.durations.average),
        },
      };
    });
  }
}

export interface GetStatsOptions {
  contents?: FapContentType[];
}

export interface FapStat {
  content: string;
  count: number;
  startDate: string;
  durations: {
    shortest: string;
    longest: string;
    total: string;
    average: string;
  };
}
