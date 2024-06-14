import { IPagingResults, IResult } from 'furaffinity-api';

export class PagingResults {
  readonly #getPrevious: (() => Promise<IPagingResults>) | undefined;
  readonly #getNext: (() => Promise<IPagingResults>) | undefined;
  previousLink: string | undefined;
  nextLink: string | undefined;
  items: IResult[];

  constructor(result: IPagingResults) {
    this.items = [...result];
    this.#getPrevious = result.prev;
    this.#getNext = result.next;
    this.previousLink = result.prevLink;
    this.nextLink = result.nextLink;
  }

  async getPrevious(): Promise<PagingResults | undefined> {
    if (!this.#getPrevious) {
      return;
    }

    return new PagingResults(await this.#getPrevious());
  }

  async getNext(): Promise<PagingResults | undefined> {
    if (!this.#getNext) {
      return;
    }

    return new PagingResults(await this.#getNext());
  }
}
