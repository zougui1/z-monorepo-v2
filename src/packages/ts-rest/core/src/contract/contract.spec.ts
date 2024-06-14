import zod from 'zod';

import { contract } from './contract';
import { Method } from '../Method';

describe('contract', () => {
  describe('get', () => {
    it('should return a GET contract with the specified path', () => {
      const path = ':id' as const;
      const data = {
        params: zod.object({
          id: zod.string(),
        }),
      };

      const contractData = contract.get(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Get,
      });
    });
  });

  describe('post', () => {
    it('should return a POST contract with the specified path', () => {
      const path = '/' as const;
      const data = {
        body: zod.object({
          name: zod.string(),
        }),
      };

      const contractData = contract.post(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Post,
      });
    });
  });

  describe('put', () => {
    it('should return a PUT contract with the specified path', () => {
      const path = '/' as const;
      const data = {
        body: zod.object({
          name: zod.string(),
        }),
      };

      const contractData = contract.put(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Put,
      });
    });
  });

  describe('patch', () => {
    it('should return a PATCH contract with the specified path', () => {
      const path = '/' as const;
      const data = {
        body: zod.object({
          name: zod.string(),
        }),
      };

      const contractData = contract.patch(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Patch,
      });
    });
  });

  describe('delete', () => {
    it('should return a DELETE contract with the specified path', () => {
      const path = ':id' as const;
      const data = {
        params: zod.object({
          id: zod.string(),
        }),
      };

      const contractData = contract.delete(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Delete,
      });
    });
  });

  describe('head', () => {
    it('should return a HEAD contract with the specified path', () => {
      const path = '/' as const;
      const data = {
        query: zod.object({
          page: zod.coerce.number(),
        }),
      };

      const contractData = contract.head(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Head,
      });
    });
  });

  describe('options', () => {
    it('should return a OPTIONS contract with the specified path', () => {
      const path = '/' as const;
      const data = {};

      const contractData = contract.options(path, data);

      expect(contractData).toEqual({
        ...data,
        path,
        method: Method.Options,
      });
    });
  });
});
