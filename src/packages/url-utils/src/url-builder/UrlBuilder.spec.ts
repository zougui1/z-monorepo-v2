import zod from 'zod';

import { UrlBuilder } from './UrlBuilder';

describe('UrlBuilder', () => {
  describe('parse', () => {
    describe('with a defined set of allowed hosts', () => {
      it('should parse any URL with the given hosts', () => {
        const url = new UrlBuilder()
          .allowedHosts(['zougui.com', 'toto.com']);

        expect(url.parse('http://zougui.com/users/Zougui')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('https://zougui.com/users/Zougui')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('ws://zougui.com/users/Zougui')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('whatever-protocol://zougui.com/users/Zougui')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('http://toto.com')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('http://zougui.com?some=param')).toEqual({
          params: {},
          query: {},
        });
      });

      it('should throw an error when the host does not match', () => {
        const url = new UrlBuilder()
          .allowedHosts(['zougui.com', 'toto.com']);

        const getResult = () => url.parse('http://somewhere.com/users/Zougui');

        expect(getResult).toThrowError();
      });
    });

    describe('with a defined set of allowed protocols', () => {
      it('should parse any URL with the given protocols', () => {
        const url = new UrlBuilder()
          .allowedProtocols(['http', 'https']);

        expect(url.parse('http://zougui.com/users/Zougui')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('https://zougui.com/users/Zougui')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('http://zougui.com')).toEqual({
          params: {},
          query: {},
        });
        expect(url.parse('http://zougui.com?some=param')).toEqual({
          params: {},
          query: {},
        });
      });

      it('should throw an error when the protocol does not match', () => {
        const url = new UrlBuilder()
          .allowedProtocols(['zougui.com', 'toto.com']);

        const getResult = () => url.parse('ws://zougui.com/users/Zougui');

        expect(getResult).toThrowError();
      });
    });

    describe('with a defined path pattern', () => {
      describe('without schema', () => {
        describe('static path', () => {
          it('should parse any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users');

            expect(url.parse('https://zougui.com/users')).toEqual({
              params: {},
              query: {},
            });
          });

          it('should throw an error when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users');

            const getResult = () => url.parse('https://zougui.com/users/Zougui');

            expect(getResult).toThrowError();
          });
        });

        describe('dynamic path', () => {
          it('should parse any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:username');

            expect(url.parse('https://zougui.com/users/Zougui')).toEqual({
              params: {
                username: 'Zougui',
              },
              query: {},
            });
          });

          it('should throw an error when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:username');

            const getResult = () => url.parse('https://zougui.com/users');

            expect(getResult).toThrowError();
          });
        });

        describe('path with optional components', () => {
          it('should parse any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:username?');

            expect(url.parse('https://zougui.com/users/Zougui')).toEqual({
              params: {
                username: 'Zougui',
              },
              query: {},
            });
            expect(url.parse('https://zougui.com/users')).toEqual({
              params: {},
              query: {},
            });
          });

          it('should throw an error when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:username?');

            const getResult = () => url.parse('https://zougui.com/user');

            expect(getResult).toThrowError();
          });
        });
      });

      describe('with schema', () => {
        describe('dynamic path', () => {
          it('should parse any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:username', {
                username: zod.enum(['Zougui', 'toto']),
              });

            expect(url.parse('https://zougui.com/users/Zougui')).toEqual({
              params: {
                username: 'Zougui',
              },
              query: {},
            });
          });

          it('should throw an error when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:username', {
                username: zod.enum(['Zougui', 'toto']),
              });

            const getResult = () => url.parse('https://zougui.com/users');

            expect(getResult).toThrowError();
          });

          it('should throw an error when the path params do not match their schema', () => {
            const url = new UrlBuilder()
              .path('/users/:username', {
                username: zod.enum(['Zougui', 'toto']),
              });

            const getResult = () => url.parse('https://zougui.com/users/unknown');

            expect(getResult).toThrowError();
          });
        });

        describe('path with optional components', () => {
          it('should parse any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:id?', {
                id: zod.coerce.number().optional(),
              });

            expect(url.parse('https://zougui.com/users/69')).toEqual({
              params: {
                id: 69,
              },
              query: {},
            });
            expect(url.parse('https://zougui.com/users')).toEqual({
              params: {},
              query: {},
            });
          });

          it('should throw an error when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:id?', {
                id: zod.coerce.number().optional(),
              });

            const getResult = () => url.parse('https://zougui.com/user');

            expect(getResult).toThrowError();
          });

          it('should throw an error when the path params do not match their schema', () => {
            const url = new UrlBuilder()
              .path('/users/:id?', {
                id: zod.coerce.number().optional(),
              });

            const getResult = () => url.parse('https://zougui.com/users/Zougui');

            expect(getResult).toThrowError();
          });
        });
      });
    });

    describe('with a defined query schema', () => {
      it('should parse the URL with the given schema', () => {
        const url = new UrlBuilder()
          .query({
            page: zod.coerce.number(),
          });

        expect(url.parse('https://zougui.com/users?page=69')).toEqual({
          params: {},
          query: {
            page: 69,
          },
        });
      });

      it('should throw an error when the query is missing parameters from the schema', () => {
        const url = new UrlBuilder()
          .query({
            page: zod.coerce.number(),
          });

        const getResult = () => url.parse('https://zougui.com/users');

        expect(getResult).toThrowError();
      });

      describe('with optional query param', () => {
        it('should parse the URL with the given schema', () => {
          const url = new UrlBuilder()
            .query({
              page: zod.coerce.number().optional(),
            });

          expect(url.parse('https://zougui.com/users?page=69')).toEqual({
            params: {},
            query: {
              page: 69,
            },
          });
        });

        it('should parse the URL when the query is missing optional parameters from the schema', () => {
          const url = new UrlBuilder()
            .query({
              page: zod.coerce.number().optional(),
            });

          expect(url.parse('https://zougui.com/users')).toEqual({
            params: {},
            query: {},
          });
        });

        it('should throw an error when the query does not match the schema', () => {
          const url = new UrlBuilder()
            .query({
              page: zod.coerce.number().optional(),
            });

          const getResult = () => url.parse('https://zougui.com/users?page=zougui');

          expect(getResult).toThrowError();
        });
      });
    });
  });

  describe('validate', () => {
    describe('with a defined set of allowed hosts', () => {
      it('should return true for any URL with the given hosts', () => {
        const url = new UrlBuilder()
          .allowedHosts(['zougui.com', 'toto.com']);

        expect(url.validate('http://zougui.com/users/Zougui')).toBe(true);
        expect(url.validate('https://zougui.com/users/Zougui')).toBe(true);
        expect(url.validate('ws://zougui.com/users/Zougui')).toBe(true);
        expect(url.validate('whatever-protocol://zougui.com/users/Zougui')).toBe(true);
        expect(url.validate('http://toto.com')).toBe(true);
        expect(url.validate('http://zougui.com?some=param')).toBe(true);
      });

      it('should return false when the host does not match', () => {
        const url = new UrlBuilder()
          .allowedHosts(['zougui.com', 'toto.com']);


        expect(url.validate('http://somewhere.com/users/Zougui')).toBe(false);
      });
    });

    describe('with a defined set of allowed protocols', () => {
      it('should return true for any URL with the given protocols', () => {
        const url = new UrlBuilder()
          .allowedProtocols(['http', 'https']);

        expect(url.validate('http://zougui.com/users/Zougui')).toBe(true);
        expect(url.validate('https://zougui.com/users/Zougui')).toBe(true);
        expect(url.validate('http://zougui.com')).toBe(true);
        expect(url.validate('http://zougui.com?some=param')).toBe(true);
      });

      it('should return false when the protocol does not match', () => {
        const url = new UrlBuilder()
          .allowedProtocols(['zougui.com', 'toto.com']);

        expect(url.validate('ws://zougui.com/users/Zougui')).toBe(false);
      });
    });

    describe('with a defined path pattern', () => {
      describe('without schema', () => {
        describe('static path', () => {
          it('should return true for any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users');

            expect(url.validate('https://zougui.com/users')).toBe(true);
          });

          it('should return false when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users');

            expect(url.validate('https://zougui.com/users/Zougui')).toBe(false);
          });
        });

        describe('dynamic path', () => {
          it('should return true for any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:username');

            expect(url.validate('https://zougui.com/users/Zougui')).toBe(true);
          });

          it('should return false when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:username');

            expect(url.validate('https://zougui.com/users')).toBe(false);
          });
        });

        describe('path with optional components', () => {
          it('should return true for any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:username?');

            expect(url.validate('https://zougui.com/users/Zougui')).toBe(true);
            expect(url.validate('https://zougui.com/users')).toBe(true);
          });

          it('should return false when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:username?');

            expect(url.validate('https://zougui.com/user')).toBe(false);
          });
        });
      });

      describe('with schema', () => {
        describe('dynamic path', () => {
          it('should return true for any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:username', {
                username: zod.enum(['Zougui', 'toto']),
              });

            expect(url.validate('https://zougui.com/users/Zougui')).toBe(true);
          });

          it('should return false when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:username', {
                username: zod.enum(['Zougui', 'toto']),
              });

            expect(url.validate('https://zougui.com/users')).toBe(false);
          });

          it('should return false when the path params do not match their schema', () => {
            const url = new UrlBuilder()
              .path('/users/:username', {
                username: zod.enum(['Zougui', 'toto']),
              });

            expect(url.validate('https://zougui.com/users/unknown')).toBe(false);
          });
        });

        describe('path with optional components', () => {
          it('should return true for any URL with the given path', () => {
            const url = new UrlBuilder()
              .path('/users/:id?', {
                id: zod.coerce.number().optional(),
              });

            expect(url.validate('https://zougui.com/users/69')).toBe(true);
            expect(url.validate('https://zougui.com/users')).toBe(true);
          });

          it('should return false when the path does not match', () => {
            const url = new UrlBuilder()
              .path('/users/:id?', {
                id: zod.coerce.number().optional(),
              });


            expect(url.validate('https://zougui.com/user')).toBe(false);
          });

          it('should return false when the path params do not match their schema', () => {
            const url = new UrlBuilder()
              .path('/users/:id?', {
                id: zod.coerce.number().optional(),
              });

            expect(url.validate('https://zougui.com/users/Zougui')).toBe(false);
          });
        });
      });
    });

    describe('with a defined query schema', () => {
      it('should return true for any URL with the given schema', () => {
        const url = new UrlBuilder()
          .query({
            page: zod.coerce.number(),
          });

        expect(url.validate('https://zougui.com/users?page=69')).toBe(true);
      });

      it('should return false when the query is missing parameters from the schema', () => {
        const url = new UrlBuilder()
          .query({
            page: zod.coerce.number(),
          });

        expect(url.validate('https://zougui.com/users')).toBe(false);
      });

      describe('with optional query param', () => {
        it('should return true for any URL with the given schema', () => {
          const url = new UrlBuilder()
            .query({
              page: zod.coerce.number().optional(),
            });

          expect(url.validate('https://zougui.com/users?page=69')).toBe(true);
        });

        it('should return true for any URL when the query is missing optional parameters from the schema', () => {
          const url = new UrlBuilder()
            .query({
              page: zod.coerce.number().optional(),
            });

          expect(url.validate('https://zougui.com/users')).toBe(true);
        });

        it('should return false when the query does not match the schema', () => {
          const url = new UrlBuilder()
            .query({
              page: zod.coerce.number().optional(),
            });

          expect(url.validate('https://zougui.com/users?page=zougui')).toBe(false);
        });
      });
    });
  });

  describe('create', () => {
    describe('without required data', () => {
      it('should throw an error when no list of allowed protocols are given', () => {
        const url = new UrlBuilder()
          .allowedHosts(['zougui.com', 'toto.com']);

        const getResult = () => url.create({ params: {}, query: {} });

        expect(getResult).toThrowError(/cannot create a url without a list of allowed protocols/i);
      });

      it('should throw an error when no list of allowed hosts are given', () => {
        const url = new UrlBuilder()
          .allowedProtocols(['http', 'https']);

        const getResult = () => url.create({ params: {}, query: {} });

        expect(getResult).toThrowError(/cannot create a url without a list of allowed hosts/i);
      });
    });

    describe('with all required data', () => {
      describe('with only the protocols and hosts', () => {
        it('should create a URL', () => {
          const url = new UrlBuilder()
            .allowedProtocols(['https', 'http'])
            .allowedHosts(['zougui.com']);

          const result = url.create({
            params: {},
            query: {},
          });
          expect(result).toBe('https://zougui.com');
        });
      });

      describe('with a defined path pattern', () => {
        describe('without schema', () => {
          describe('static path', () => {
            it('should return the URL', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users');

              expect(url.create({ params: {}, query: {} })).toBe('https://zougui.com/users');
            });
          });

          describe('dynamic path', () => {
            it('should return the URL', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:username');

              const result = url.create({
                params: {
                  username: 'Zougui',
                },
                query: {},
              });
              expect(result).toBe('https://zougui.com/users/Zougui');
            });

            it('should throw an error when the param is not given', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:username');

              const getResult = () => url.create({
                // @ts-expect-error
                params: {},
                query: {},
              });
              expect(getResult).toThrowError();
            });
          });

          describe('path with optional components', () => {
            it('should return the URL with the optional param', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:username?');

              const result = url.create({
                params: {
                  username: 'Zougui',
                },
                query: {},
              });
              expect(result).toBe('https://zougui.com/users/Zougui');
            });

            it('should return the URL without the optional param', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:username?');

              const result = url.create({
                params: {},
                query: {},
              });
              expect(result).toBe('https://zougui.com/users');
            });
          });
        });

        describe('with schema', () => {
          describe('dynamic path', () => {
            it('should return the URL', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:username', {
                  username: zod.enum(['Zougui', 'toto']),
                });

              const result = url.create({
                params: {
                  username: 'Zougui',
                },
                query: {},
              });
              expect(result).toBe('https://zougui.com/users/Zougui');
            });

            it('should throw an error when the param does not match its schema', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:username', {
                  username: zod.enum(['Zougui', 'toto']),
                });

              const getResult = () => url.create({
                params: {
                  // @ts-expect-error
                  username: 'unknown',
                },
                query: {},
              });

              expect(getResult).toThrowError();
            });
          });

          describe('path with optional components', () => {
            it('should return the URL with its optional param', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:id?', {
                  id: zod.coerce.number().optional(),
                });

              const result = url.create({
                params: {
                  id: 69,
                },
                query: {},
              });

              expect(result).toBe('https://zougui.com/users/69');
            });

            it('should return the URL without its optional param', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:id?', {
                  id: zod.coerce.number().optional(),
                });

              const result = url.create({
                params: {},
                query: {},
              });

              expect(result).toBe('https://zougui.com/users');
            });

            it('should throw an error when the param does not match its schema', () => {
              const url = new UrlBuilder()
                .allowedProtocols(['https', 'http'])
                .allowedHosts(['zougui.com'])
                .path('/users/:id?', {
                  id: zod.coerce.number().optional(),
                });

              const getResult = () => url.create({
                params: {
                  // @ts-expect-error
                  id: 'Zougui',
                },
                query: {},
              });

              expect(getResult).toThrowError();
            });
          });
        });
      });

      describe('with a defined query schema', () => {
        it('should return the URL with the given schema', () => {
          const url = new UrlBuilder()
            .allowedProtocols(['https', 'http'])
            .allowedHosts(['zougui.com'])
            .query({
              page: zod.coerce.number(),
            });

          const result = url.create({
            params: {},
            query: {
              page: 69,
            },
          });

          expect(result).toBe('https://zougui.com?page=69');
        });

        it('should throw an error when the query is missing parameters from the schema', () => {
          const url = new UrlBuilder()
            .allowedProtocols(['https', 'http'])
            .allowedHosts(['zougui.com'])
            .query({
              page: zod.coerce.number(),
            });

          const getResult = () => url.create({
            params: {},
            // @ts-expect-error
            query: {},
          });

          expect(getResult).toThrowError();
        });

        describe('with optional query param', () => {
          it('should return the URL with the given schema', () => {
            const url = new UrlBuilder()
              .allowedProtocols(['https', 'http'])
              .allowedHosts(['zougui.com'])
              .query({
                page: zod.coerce.number().optional(),
              });

            const result = url.create({
              params: {},
              query: {
                page: 69,
              },
            });

            expect(result).toBe('https://zougui.com?page=69');
          });

          it('should return the URL when the query is missing optional parameters from the schema', () => {
            const url = new UrlBuilder()
              .allowedProtocols(['https', 'http'])
              .allowedHosts(['zougui.com'])
              .query({
                page: zod.coerce.number().optional(),
              });

            const result = url.create({
              params: {},
              query: {},
            });

            expect(result).toBe('https://zougui.com');
          });

          it('should throw an error when the query does not match the schema', () => {
            const url = new UrlBuilder()
              .allowedProtocols(['https', 'http'])
              .allowedHosts(['zougui.com'])
              .query({
                page: zod.coerce.number().optional(),
              });

            const getResult = () => url.create({
              params: {},
              query: {
                // @ts-expect-error
                page: 'zougui',
              },
            });

            expect(getResult).toThrowError();
          });
        });
      });
    });
  });
});
