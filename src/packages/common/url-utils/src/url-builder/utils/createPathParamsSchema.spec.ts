import zod from 'zod';

import { createPathParamsSchema } from './createPathParamsSchema';

describe('createPathParamsSchema', () => {
  describe('when a schema is provided', () => {
    it('should return the schema as is', () => {
      const pathPattern = undefined;
      const pathSchema = zod.object({
        id: zod.coerce.number(),
      });

      const result = createPathParamsSchema(pathPattern, pathSchema);

      expect(result.parse({ id: '69' })).toEqual({ id: 69 });
      expect(() => result.parse({ id: 'toto' })).toThrowError();
      expect(() => result.parse({})).toThrowError();
    });
  });

  describe('when no pattern is provided', () => {
    it('should return an empty object schema', () => {
      const pathPattern = undefined;
      const pathSchema = undefined;

      const result = createPathParamsSchema(pathPattern, pathSchema);

      expect(result.parse({ id: '69' })).toEqual({});
    });
  });

  describe('when a pattern is provided', () => {
    it('should return a schema for the parameters', () => {
      const pathPattern = '/users/:id';
      const pathSchema = undefined;

      const result = createPathParamsSchema(pathPattern, pathSchema);

      expect(result.parse({ id: 69 })).toEqual({ id: 69 });
      expect(result.parse({ id: 'toto' })).toEqual({ id: 'toto' });
      // missing property
      expect(() => result.parse({})).toThrowError();
      // invalid type
      expect(() => result.parse({ id: new Date() })).toThrowError();
    });

    it('should return a schema for optional parameters', () => {
      const pathPattern = '/users/:id?';
      const pathSchema = undefined;

      const result = createPathParamsSchema(pathPattern, pathSchema);

      expect(result.parse({ id: 69 })).toEqual({ id: 69 });
      expect(result.parse({ id: 'toto' })).toEqual({ id: 'toto' });
      expect(result.parse({})).toEqual({});
      // invalid type
      expect(() => result.parse({ id: new Date() })).toThrowError();
    });
  });
});
