import * as furaffinityApi from 'furaffinity-api';

import { Query, BrowseOptions, SearchOptions } from './Query';
import { PagingResults } from './PagingResults';

describe('Query', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('browse', () => {
    it('should return the result', async () => {
      const options: BrowseOptions = {
        page: 69,
      };

      jest.spyOn(furaffinityApi, 'browse').mockResolvedValue([]);

      const query = new Query();
      const result = await query.browse(options);

      expect(result).toBeInstanceOf(PagingResults);
      expect(furaffinityApi.browse).toBeCalledTimes(1);
      expect(furaffinityApi.browse).toBeCalledWith(options);
    });
  });

  describe('search', () => {
    it('should return the result', async () => {
      const queryString = 'dragon';
      const options: SearchOptions = {
        page: 69,
      };

      jest.spyOn(furaffinityApi, 'search').mockResolvedValue([]);

      const query = new Query();
      const result = await query.search(queryString, options);

      expect(result).toBeInstanceOf(PagingResults);
      expect(furaffinityApi.search).toBeCalledTimes(1);
      expect(furaffinityApi.search).toBeCalledWith(queryString, options);
    });
  });

  describe('findById', () => {
    it('should throw the error as is if it is not an error object', async () => {
      const id = '69';
      const errorMessage = 'something terrible happened';

      jest.spyOn(furaffinityApi, 'submission').mockRejectedValue(errorMessage);

      const query = new Query();

      try {
        await query.findById(id);
        throw new Error('the function should have rejected but resolved instead.');
      } catch (error) {
        expect(error).toBe(errorMessage);
      }

      expect(furaffinityApi.submission).toBeCalledTimes(1);
      expect(furaffinityApi.submission).toBeCalledWith(id);
    });

    it('should throw an error when an unknown error occured', async () => {
      const id = '69';
      const errorMessage = 'something bad happened';

      jest.spyOn(furaffinityApi, 'submission').mockRejectedValue(new Error(errorMessage));

      const query = new Query();
      const getResult = () => query.findById(id);

      await expect(getResult).rejects.toThrowError(/could not find the submission/i);
      expect(furaffinityApi.submission).toBeCalledTimes(1);
      expect(furaffinityApi.submission).toBeCalledWith(id);
    });

    it('should return undefined when an error saying the submission could not be found is thrown', async () => {
      const id = '69';

      jest
        .spyOn(furaffinityApi, 'submission')
        .mockRejectedValue(new Error('The submission is not in our database'));

      const query = new Query();
      const result = await query.findById(id);

      expect(result).toBeUndefined();
      expect(furaffinityApi.submission).toBeCalledTimes(1);
      expect(furaffinityApi.submission).toBeCalledWith(id);
    });

    it('should return the submission when found', async () => {
      const id = '69';

      jest
        .spyOn(furaffinityApi, 'submission')
        .mockResolvedValue({ id, title: 'Nice dragon' } as any);
      const query = new Query();
      const result = await query.findById(id);

      expect(result).toEqual({ id, title: 'Nice dragon' });
      expect(furaffinityApi.submission).toBeCalledTimes(1);
      expect(furaffinityApi.submission).toBeCalledWith(id);
    });
  });
});
