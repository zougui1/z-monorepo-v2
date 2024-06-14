import zod from 'zod';

import { parseUrl, ParseUrlOptions } from './parseUrl';

describe('parseUrl', () => {
  describe('validate protocols', () => {
    it('should not throw when the protocol is in the URL is in the valid protocols', () => {
      const url = 'https://zougui.com';
      const options: ParseUrlOptions<any, any, any> = {
        protocols: ['http', 'https'],
      };

      parseUrl(url, options);
    });

    it('should throw an error when the protocol is not in the URL is in the valid protocols', () => {
      const url = 'https://zougui.com';
      const options: ParseUrlOptions<any, any, any> = {
        protocols: ['http'],
      };

      const getResult = () => parseUrl(url, options);

      expect(getResult).toThrowError('Invalid protocol');
    });
  });

  describe('validate hosts', () => {
    it('should not throw when the host is in the URL is in the valid hosts', () => {
      const url = 'https://zougui.com';
      const options: ParseUrlOptions<any, any, any> = {
        hosts: ['zougui.com'],
      };

      parseUrl(url, options);
    });

    it('should throw an error when the host is not in the URL is in the valid hosts', () => {
      const url = 'https://subdomain.zougui.com';
      const options: ParseUrlOptions<any, any, any> = {
        hosts: ['zougui.com'],
      };

      const getResult = () => parseUrl(url, options);

      expect(getResult).toThrowError('Invalid host');
    });
  });

  describe('parse params', () => {
    describe('without schema', () => {
      it('should parse the path params according to the path scheme', () => {
        const url = 'https://zougui.com/some/path/14574541/edit';
        const options = {
          params: {
            scheme: '/some/path/:id/edit' as const,
          },
        } satisfies ParseUrlOptions<any, any, any>;

        const result = parseUrl(url, options);

        expect(result).toEqual({
          params: {
            id: '14574541',
          },
          query: {},
        });
      });

      it('should parse the path params according to the path scheme when the URL is missing an optional param', () => {
        const url = 'https://zougui.com/some/path/14574541/edit';
        const options = {
          params: {
            scheme: '/some/path/:id/edit/:something?' as const,
          },
        } satisfies ParseUrlOptions<any, any, any>;

        const result = parseUrl(url, options);

        expect(result).toEqual({
          params: {
            id: '14574541',
            something: undefined,
          },
          query: {},
        });
      });

      it('should throw an error when the path does not correspond to the scheme', () => {
        const url = 'https://zougui.com/some/haha/14574541/edit';
        const options = {
          params: {
            scheme: '/some/path/:id/edit/:something?' as const,
          },
        } satisfies ParseUrlOptions<any, any, any>;

        const getResult = () => parseUrl(url, options);

        expect(getResult).toThrowError('Invalid pathname');
      });
    });

    describe('with schema', () => {
      it('should parse the path params according to the path scheme', () => {
        const url = 'https://zougui.com/some/154564';
        const options = {
          params: {
            scheme: '/some/:id/:something?' as const,
            schema: zod.object({
              id: zod.coerce.number(),
              something: zod.string().optional(),
            }),
          },
        } satisfies ParseUrlOptions<any, any, any>;

        const result = parseUrl(url, options);

        expect(result).toEqual({
          params: {
            id: 154564,
            something: undefined,
          },
          query: {},
        });
      });

      it('should throw an error when a param does not match with the schema', () => {
        const url = 'https://zougui.com/some/toto';
        const options = {
          params: {
            scheme: '/some/:id/:something?' as const,
            schema: zod.object({
              id: zod.coerce.number(),
              something: zod.string().optional(),
            }),
          },
        } satisfies ParseUrlOptions<any, any, any>;

        const getResult = () => parseUrl(url, options);

        expect(getResult).toThrowError('Expected number, received nan');
      });
    });
  });

  describe('parse query string', () => {
    it('should parse the path params according to the path scheme', () => {
      const url = 'https://zougui.com?search=some string&num=69&arr[]=42';
      const options = {
        query: {
          schema: zod.object({
            search: zod.string(),
            num: zod.coerce.number(),
            arr: zod.array(zod.coerce.number()),
          }),
        },
      } satisfies ParseUrlOptions<any, any, any>;

      const result = parseUrl(url, options);

      expect(result).toEqual({
        params: {},
        query: {
          search: 'some string',
          num: 69,
          arr: [42],
        },
      });
    });

    it('should throw an error when the query string does not correspond to the schema', () => {
      const url = 'https://zougui.com?search[]=oh no&num=toto&arr=uazg';
      const options = {
        query: {
          schema: zod.object({
            search: zod.string(),
            num: zod.coerce.number(),
            arr: zod.array(zod.coerce.number()),
          }),
        },
      } satisfies ParseUrlOptions<any, any, any>;

      const getResult = () => parseUrl(url, options);

      expect(getResult).toThrowError();
    });
  });
});
