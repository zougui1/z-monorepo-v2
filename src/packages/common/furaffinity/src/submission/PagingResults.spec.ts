import { IPagingResults } from 'furaffinity-api';

import { PagingResults } from './PagingResults';

describe('PagingResults', () => {
  describe('constructor', () => {
    it('should construct the object without the links', () => {
      const data: IPagingResults = [{}, {}] as any;

      const paging = new PagingResults(data);

      expect(paging.items).toEqual([{}, {}]);
      expect(paging.previousLink).toBeUndefined();
      expect(paging.nextLink).toBeUndefined();
    });

    it('should construct the object with the links', () => {
      const data: IPagingResults = [{}, {}] as any;
      data.prevLink = 'https://furaffinity/search?page=1';
      data.nextLink = 'https://furaffinity/search?page=3';

      const paging = new PagingResults(data);

      expect(paging.items).toEqual([{}, {}]);
      expect(paging.previousLink).toBe('https://furaffinity/search?page=1');
      expect(paging.nextLink).toBe('https://furaffinity/search?page=3');
    });
  });

  describe('getPrevious', () => {
    it('should return undefined when there is no function to fetch the previous data', async () => {
      const data: IPagingResults = [];

      const paging = new PagingResults(data);
      const result = await paging.getPrevious();

      expect(result).toBeUndefined();
    });

    it('should return the data from the function to fetch the previous data', async () => {
      const data: IPagingResults = [];
      data.prev = async () => [];

      const paging = new PagingResults(data);
      const result = await paging.getPrevious();

      expect(result).toBeInstanceOf(PagingResults);
    });
  });

  describe('getNext', () => {
    it('should return undefined when there is no function to fetch the next data', async () => {
      const data: IPagingResults = [];

      const paging = new PagingResults(data);
      const result = await paging.getNext();

      expect(result).toBeUndefined();
    });

    it('should return the data from the function to fetch the next data', async () => {
      const data: IPagingResults = [];
      data.next = async () => [];

      const paging = new PagingResults(data);
      const result = await paging.getNext();

      expect(result).toBeInstanceOf(PagingResults);
    });
  });
});
