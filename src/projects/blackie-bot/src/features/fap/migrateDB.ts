import { Client, isFullPage, iteratePaginatedAPI } from '@notionhq/client';

import { Fap } from './database';
import { env } from '../../env';
import { DateTime } from 'luxon';

const getAllDatabaseEntries = async (databaseId: string): Promise<any[]> => {
  const notion = new Client({ auth: env.notion.token });
  const results: any[] = [];

  let hasMore = true;
  let startCursor: string | undefined;
  let page = 0;

  while (hasMore) {
    console.log('page', ++page);

    const query = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      start_cursor: startCursor,
    });

    hasMore = query.has_more;
    startCursor = query.next_cursor || undefined;
    results.push(...query.results);
  }

  console.log('entries', results.length);

  return results;
}

export const migrateDB = async () => {
  const entries = await getAllDatabaseEntries('7da9327ee9834b1fb71e15230a53eac1');
  let i = 0;

  for (const entry of entries) {
    await Fap.Prod.create({
      content: entry.properties.Content.select.name,
      startDate: DateTime.fromISO(entry.properties.Date.date.start),
      endDate: DateTime.fromISO(entry.properties.Date.date.end),
    });
    console.log('added entry', ++i);
  }
}
