import { ISubmission } from 'furaffinity-api';
import * as furaffinityApi from 'furaffinity-api';
import { BrowseOptions, SearchOptions } from 'furaffinity-api/dist/Request';

import { PagingResults } from './PagingResults';

export class Query {
  async browse(options?: BrowseOptions | undefined): Promise<PagingResults> {
    return new PagingResults(await furaffinityApi.browse(options));
  }

  async search(query: string, options?: SearchOptions | undefined): Promise<PagingResults> {
    return new PagingResults(await furaffinityApi.search(query, options));
  }

  async findById(id: string): Promise<ISubmission | undefined> {
    try {
      return await furaffinityApi.submission(id);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      if (error.message.toLowerCase().includes('not in our database')) {
        return undefined;
      }

      throw new Error(
        'Could not find the submission. It is possible the submission requires you to be logged in or is not accessible to you.',
        { cause: error },
      );
    }
  }
}

export type { BrowseOptions, SearchOptions };
