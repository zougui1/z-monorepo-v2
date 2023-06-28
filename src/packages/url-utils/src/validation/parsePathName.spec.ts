import zod from 'zod';

import { parsePathName } from './parsePathName';

describe('parsePathName', () => {
  describe('without schema', () => {
    it('should correctly parse the path params', () => {
      const url = 'https://zougui.com/some/path/14574541/edit';
      const pathNameScheme = '/some/path/:id/edit' as const;

      const result = parsePathName(url, pathNameScheme);

      expect(result).toEqual({
        id: '14574541',
      });
    });

    it('should correctly parse the path params when the URL is missing an optional param', () => {
      const url = 'https://zougui.com/some/path/14574541/edit';
      const pathNameScheme = '/some/path/:id/edit/:something?' as const;

      const result = parsePathName(url, pathNameScheme);

      expect(result).toEqual({
        id: '14574541',
        something: undefined,
      });
    });

    it('should throw an error when the path name does not correspond to the scheme', () => {
      const url = 'https://zougui.com/some/haha/14574541/edit';
      const pathNameScheme = '/some/path/:id/edit/:something?' as const;

      const getResult = () => parsePathName(url, pathNameScheme);

      expect(getResult).toThrowError('Invalid pathname');
    });
  });

  describe('with schema', () => {
    it('should correctly parse the path params', () => {
      const url = 'https://zougui.com/some/path/14574541/edit';
      const pathNameScheme = '/some/path/:id/edit' as const;
      const schema = zod.object({
        id: zod.coerce.number(),
      });

      const result = parsePathName(url, pathNameScheme, schema);

      expect(result).toEqual({
        id: 14574541,
      });
    });

    it('should correctly parse the path params when the URL is missing an optional param', () => {
      const url = 'https://zougui.com/some/path/14574541/edit';
      const pathNameScheme = '/some/path/:id/edit/:something?' as const;
      const schema = zod.object({
        id: zod.coerce.number(),
        something: zod.string().optional(),
      });

      const result = parsePathName(url, pathNameScheme, schema);

      expect(result).toEqual({
        id: 14574541,
        something: undefined,
      });
    });

    it('should throw an error when a param does not match with the schema', () => {
      const url = 'https://zougui.com/some/path/toto/edit';
      const pathNameScheme = '/some/path/:id/edit' as const;
      const schema = zod.object({
        id: zod.coerce.number(),
      });

      const getResult = () => parsePathName(url, pathNameScheme, schema);

      expect(getResult).toThrowError('Expected number, received nan');
    });
  });
});
