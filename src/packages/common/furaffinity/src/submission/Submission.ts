import { isAbsoluteUrl } from '@zougui/common.url-utils';

import { Query, BrowseOptions, SearchOptions } from './Query';
import { submissionUrl } from './submissionUrl';
import { convertSubmission, SubmissionData } from './SubmissionData';
import { PagingResults } from './PagingResults';
import { Account, AccountOptions } from '../Account';

export class Submission {
  readonly #account: Account;
  readonly #query: Query = new Query();

  constructor(options: SubmissionOptions) {
    this.#account = new Account(options);
  }

  async browse(options?: BrowseOptions | undefined): Promise<PagingResults> {
    await this.#account.login();
    return await this.#query.browse(options);
  }

  async search(query: string, options?: SearchOptions | undefined): Promise<PagingResults> {
    await this.#account.login();
    return await this.#query.search(query, options);
  }

  async findOne(idOrUrl: string | number): Promise<SubmissionData | undefined> {
    const id = typeof idOrUrl === 'string' && isAbsoluteUrl(idOrUrl)
      ? submissionUrl.parse(idOrUrl).params.id
      : idOrUrl;

    await this.#account.login();
    const submission = await this.#query.findById(String(id));

    if (submission) {
      return convertSubmission(submission);
    }
  }
}

export interface SubmissionOptions extends AccountOptions {

}
