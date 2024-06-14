import { expectTypeOf } from 'expect-type';

import { z, type MongoObject } from '../schema';
import * as connection from '../client';
import { QueryBuilder } from './QueryBuilder';

jest.mock('../client', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        createModel: (name: string, schema: MongoObject) => ({
          query: () => new QueryBuilder({ model: { find: async () => [] } } as any, schema, true, false),
        }),
      } as any;
    }),
  };
});

describe('QueryBuilder:types', () => {
  describe('schema1', () => {
    const schema = z.object({
      name: z.string(),
      createdAt: z.date().default(() => new Date()),
      age: z.number().optional(),
      things: z.union([
        z.number(),
        z.string(),
        z.boolean(),
      ]).optional(),

      address: z.object({
        country: z.string(),
        city: z.string(),
        street: z.string(),
        zipcode: z.number(),
        type: z.enum(['house', 'apartment']),
      }).optional(),
    });

    const query = () => {
      const db = new connection.Client('mongodb://127.0.0.1:27017/test');
      const Test = db.createModel('tests', schema);
      return Test.query();
    }

    it('should support the types of the schema as is with an empty query', async () => {
      const result = await query().find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
        things?: string | number | boolean | null | undefined;
        address?: {
          type: string;
          country: string;
          city: string;
          street: string;
          zipcode: number;
        } | null | undefined;
      }[]>();
    });

    it('should support selected properties', async () => {
      const result = await query().select(['name', 'createdAt', 'age']).find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
      }[]>();
    });

    it('should support unselected properties', async () => {
      const result = await query().unselect(['address', 'things']).find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
      }[]>();
    });

    it('should support unselecting _id', async () => {
      const result = await query().unselect(['address', 'things', '_id']).find();

      expectTypeOf(result).toEqualTypeOf<{
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
      }[]>();
    });

    it('should support picked properties', async () => {
      const result = await query()
        .pick({ name: true, createdAt: false, age: true, things: true })
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        age?: number | null | undefined;
        things?: string | number | boolean | null | undefined;
      }[]>();
    });

    it('should support not picking _id', async () => {
      const result = await query()
        .pick({ name: true, createdAt: false, age: true, things: true, _id: false })
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        name: string;
        age?: number | null | undefined;
        things?: string | number | boolean | null | undefined;
      }[]>();
    });

    it('should support omitted properties', async () => {
      const result = await query()
        .omit({ address: true, createdAt: true })
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        age?: number | null | undefined;
        things?: string | number | boolean | null | undefined;
      }[]>();
    });

    it('should support omitting _id', async () => {
      const result = await query()
        .omit({ address: true, createdAt: true, _id: true })
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        name: string;
        age?: number | null | undefined;
        things?: string | number | boolean | null | undefined;
      }[]>();
    });

    it('should support sub-queries on objects', async () => {
      const result = await query()
        .sub('address', subQuery => subQuery
          .where('country', '!=', 'france')
          .select(['country', 'city', 'type'])
        )
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
        things?: string | number | boolean | null | undefined;
        address?: {
          type: string;
          country: string;
          city: string;
        } | null | undefined;
      }[]>();
    });

    it('should support requiring optional properties', async () => {
      const result = await query()
        .whereNotNull('things')
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
        things: string | number | boolean;
        address?: {
          type: string;
          country: string;
          city: string;
          street: string;
          zipcode: number;
        } | null | undefined;
      }[]>();
    });

    it('should support requiring union properties to be of a specific type', async () => {
      const result = await query()
        .whereType('things', 'string')
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
        things: string;
        address?: {
          type: string;
          country: string;
          city: string;
          street: string;
          zipcode: number;
        } | null | undefined;
      }[]>();
    });

    it('should support requiring union properties to be nullish', async () => {
      const result = await query()
        .whereType('things', 'null')
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        name: string;
        createdAt: Date;
        age?: number | null | undefined;
        things: null;
        address?: {
          type: string;
          country: string;
          city: string;
          street: string;
          zipcode: number;
        } | null | undefined;
      }[]>();
    });

    it('should support "not" queries', async () => {
      const result = await query()
        .whereOr(unionBuilder => unionBuilder
          .branch(subQuery => subQuery.whereType('things', 'number'))
          .branch(subQuery => subQuery.whereType('things', 'string'))
        )
        .not(subQuery => subQuery
          .whereType('age', 'number')
          .whereNotNull('address')
        )
        .select(['age', 'things', 'address'])
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        age?: null | undefined;
        things: string | number;
        address?: null | undefined;
      }[]>();
    });
  });

  describe('schema2', () => {
    const schema = z.object({
      comments: z.array(z.object({
        text: z.string(),
        postedAt: z.date(),
      })).optional(),
      posts: z.array(z.string()),
    });

    const query = () => {
      const db = new connection.Client('mongodb://127.0.0.1:27017/test');
      const Test = db.createModel('tests', schema);
      return Test.query();
    }

    it('should support sub-queries on arrays of objects', async () => {
      const result = await query()
        .sub('comments', subQuery => subQuery
          .where('text', '!=', '')
          .select(['text'])
        )
        .find();

      expectTypeOf(result).toEqualTypeOf<{
        _id: string;
        comments?: { text: string; }[] | undefined | null;
        posts: string[];
      }[]>();
    });
  });

  describe('operators', () => {
    const schema = z.object({
      myString: z.string(),
      myNumber: z.number(),
      myBoolean: z.boolean(),
      myBigInt: z.bigInt(),
      myDate: z.date(),
      myNull: z.null(),
      myEnum: z.enum(['val1' as const, 'val2' as const]),
      myUnion: z.union([
        z.string(),
        z.number(),
        z.date(),
      ]),
      myArray: z.array(z.string()),
      myObject: z.object({
        nested: z.string(),
      }),

      myOptionalString: z.string().optional(),
      myOptionalNumber: z.number().optional(),
      myOptionalBoolean: z.boolean().optional(),
      myOptionalBigInt: z.bigInt().optional(),
      myOptionalDate: z.date().optional(),
      myOptionalNull: z.null().optional(),
      myOptionalEnum: z.enum(['val1' as const, 'val2' as const]).optional(),
      myOptionalUnion: z.union([
        z.string(),
        z.number(),
        z.date(),
      ]).optional(),
      myOptionalArray: z.array(z.string()).optional(),
      myOptionalObject: z.object({
        nested: z.string().optional(),
      }).optional(),

      myDefaultString: z.string().default('69'),
      myDefaultNumber: z.number().default(69),
      myDefaultBoolean: z.boolean().default(true),
      myDefaultBigInt: z.bigInt().default(BigInt(69)),
      myDefaultDate: z.date().default(new Date(69)),
      myDefaultNull: z.null().default(null),
      myDefaultEnum: z.enum(['val1' as const, 'val2' as const]).default('val2'),
      myDefaultUnion: z.union([
        z.string(),
        z.number(),
        z.date(),
      ]).default('69'),
      myDefaultArray: z.array(z.string()).default(['69']),
      myDefaultObject: z.object({
        nested: z.string().default('69'),
      }).default({ nested: '69' }),
    });

    const query = () => {
      const db = new connection.Client('mongodb://127.0.0.1:27017/test');
      const Test = db.createModel('tests', schema);
      return Test.query();
    }

    describe('non-optional properties', () => {
      describe('string', () => {
        it('should support ==', () => {
          query().where('myString', '==', 'value');
        });

        it('should support !=', () => {
          query().where('myString', '!=', 'value');
        });

        it('should support in', () => {
          query().where('myString', 'in', ['value']);
        });

        it('should support nin', () => {
          query().where('myString', 'nin', ['value']);
        });

        it('should support regex', () => {
          query().where('myString', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myString', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myString', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myString', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myString', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myString', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myString', 'size', 5);
        });
      });

      describe('enum', () => {
        it('should support == only for a value matching the enum', () => {
          query().where('myEnum', '==', 'val1');
          query().where('myEnum', '==', 'val2');
          // @ts-expect-error
          query().where('myEnum', '==', 'value');
        });

        it('should support != only for a value matching the enum', () => {
          query().where('myEnum', '!=', 'val1');
          query().where('myEnum', '!=', 'val2');
          // @ts-expect-error
          query().where('myEnum', '!=', 'value');
        });

        it('should support in only for a value matching the enum', () => {
          query().where('myEnum', 'in', ['val1']);
          query().where('myEnum', 'in', ['val2']);
          // @ts-expect-error
          query().where('myEnum', 'in', ['value']);
        });

        it('should support nin only for a value matching the enum', () => {
          query().where('myEnum', 'nin', ['val1']);
          query().where('myEnum', 'nin', ['val2']);
          // @ts-expect-error
          query().where('myEnum', 'nin', ['value']);
        });

        it('should support regex only for a value matching the enum', () => {
          query().where('myEnum', 'regex', /val/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myEnum', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myEnum', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myEnum', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myEnum', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myEnum', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myEnum', 'size', 5);
        });
      });

      describe('number', () => {
        it('should support ==', () => {
          query().where('myNumber', '==', 5);
        });

        it('should support !=', () => {
          query().where('myNumber', '!=', 5);
        });

        it('should support >', () => {
          query().where('myNumber', '>', 5);
        });

        it('should support >=', () => {
          query().where('myNumber', '>=', 5);
        });

        it('should support <', () => {
          query().where('myNumber', '<', 5);
        });

        it('should support <=', () => {
          query().where('myNumber', '<=', 5);
        });

        it('should support in', () => {
          query().where('myNumber', 'in', [5]);
        });

        it('should support nin', () => {
          query().where('myNumber', 'nin', [5]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myNumber', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myNumber', 'all', [5]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myNumber', 'size', 5);
        });
      });

      describe('bigInt', () => {
        it('should support ==', () => {
          query().where('myBigInt', '==', BigInt(5));
        });

        it('should support !=', () => {
          query().where('myBigInt', '!=', BigInt(5));
        });

        it('should support >', () => {
          query().where('myBigInt', '>', BigInt(5));
        });

        it('should support >=', () => {
          query().where('myBigInt', '>=', BigInt(5));
        });

        it('should support <', () => {
          query().where('myBigInt', '<', BigInt(5));
        });

        it('should support <=', () => {
          query().where('myBigInt', '<=', BigInt(5));
        });

        it('should support in', () => {
          query().where('myBigInt', 'in', [BigInt(5)]);
        });

        it('should support nin', () => {
          query().where('myBigInt', 'nin', [BigInt(5)]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myBigInt', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myBigInt', 'all', [BigInt(5)]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myBigInt', 'size', 5);
        });
      });

      describe('date', () => {
        it('should support ==', () => {
          query().where('myDate', '==', new Date(5));
        });

        it('should support !=', () => {
          query().where('myDate', '!=', new Date(5));
        });

        it('should support >', () => {
          query().where('myDate', '>', new Date(5));
        });

        it('should support >=', () => {
          query().where('myDate', '>=', new Date(5));
        });

        it('should support <', () => {
          query().where('myDate', '<', new Date(5));
        });

        it('should support <=', () => {
          query().where('myDate', '<=', new Date(5));
        });

        it('should support in', () => {
          query().where('myDate', 'in', [new Date(5)]);
        });

        it('should support nin', () => {
          query().where('myDate', 'nin', [new Date(5)]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDate', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDate', 'all', [new Date(5)]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDate', 'size', 5);
        });
      });

      describe('boolean', () => {
        it('should support ==', () => {
          query().where('myBoolean', '==', true);
        });

        it('should support !=', () => {
          query().where('myBoolean', '!=', true);
        });

        it('should support in', () => {
          query().where('myBoolean', 'in', [true]);
        });

        it('should support nin', () => {
          query().where('myBoolean', 'nin', [true]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myBoolean', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myBoolean', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myBoolean', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myBoolean', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myBoolean', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myBoolean', 'all', [true]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myBoolean', 'size', 5);
        });
      });

      describe('null', () => {
        it('should support ==', () => {
          query().where('myNull', '==', null);
        });

        it('should support !=', () => {
          query().where('myNull', '!=', null);
        });

        it('should support in', () => {
          query().where('myNull', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myNull', 'nin', [null]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myNull', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myNull', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myNull', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myNull', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myNull', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myNull', 'all', [null]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myNull', 'size', 5);
        });
      });

      describe('array', () => {
        it('should support in only for a type matching the schema', () => {
          query().where('myArray', 'in', ['value']);
          // @ts-expect-error
          query().where('myArray', 'in', [5]);
          // @ts-expect-error
          query().where('myArray', 'in', [true]);
          // @ts-expect-error
          query().where('myArray', 'in', [new Date(5)]);
          // @ts-expect-error
          query().where('myArray', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myArray', 'in', [null]);
          // @ts-expect-error
          query().where('myArray', 'in', [[]]);
          // @ts-expect-error
          query().where('myArray', 'in', [{}]);
        });

        it('should support nin only for a type matching the schema', () => {
          query().where('myArray', 'nin', ['value']);
          // @ts-expect-error
          query().where('myArray', 'nin', [5]);
          // @ts-expect-error
          query().where('myArray', 'nin', [true]);
          // @ts-expect-error
          query().where('myArray', 'nin', [new Date(5)]);
          // @ts-expect-error
          query().where('myArray', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myArray', 'nin', [null]);
          // @ts-expect-error
          query().where('myArray', 'nin', [[]]);
          // @ts-expect-error
          query().where('myArray', 'nin', [{}]);
        });

        it('should support all only for a type matching the schema', () => {
          query().where('myArray', 'all', ['value']);
          // @ts-expect-error
          query().where('myArray', 'all', [5]);
          // @ts-expect-error
          query().where('myArray', 'all', [true]);
          // @ts-expect-error
          query().where('myArray', 'all', [new Date(5)]);
          // @ts-expect-error
          query().where('myArray', 'all', [BigInt(5)]);
          // @ts-expect-error
          query().where('myArray', 'all', [null]);
          // @ts-expect-error
          query().where('myArray', 'all', [[]]);
          // @ts-expect-error
          query().where('myArray', 'all', [{}]);
        });

        it('should support size', () => {
          query().where('myArray', 'size', 5);
        });

        it('should not support ==', () => {
          // @ts-expect-error
          query().where('myArray', '==', ['value']);
        });

        it('should not support !=', () => {
          // @ts-expect-error
          query().where('myArray', '!=', ['value']);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myArray', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myArray', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myArray', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myArray', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myArray', '<=', 5);
        });
      });

      describe('object', () => {
        it('should support ==', () => {
          query().where('myObject', '==', { nested: 'value' });
          // @ts-expect-error
          query().where('myObject', '==', {});
          // @ts-expect-error
          query().where('myObject', '==', { unknown: 'value' });
        });

        it('should support !=', () => {
          query().where('myObject', '!=', { nested: 'value' });
          // @ts-expect-error
          query().where('myObject', '!=', {});
          // @ts-expect-error
          query().where('myObject', '!=', { unknown: 'value' });
        });

        it('should support in', () => {
          query().where('myObject', 'in', [{ nested: 'value' }]);
          // @ts-expect-error
          query().where('myObject', 'in', [{}]);
          // @ts-expect-error
          query().where('myObject', 'in', [{ unknown: 'value' }]);
        });

        it('should support nin', () => {
          query().where('myObject', 'nin', [{ nested: 'value' }]);
          // @ts-expect-error
          query().where('myObject', 'nin', [{}]);
          // @ts-expect-error
          query().where('myObject', 'nin', [{ unknown: 'value' }]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myObject', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myObject', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myObject', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myObject', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myObject', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myObject', 'all', [true]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myObject', 'size', 5);
        });
      });

      describe('union', () => {
        it('should support ==', () => {
          query().where('myUnion', '==', 'value');
          query().where('myUnion', '==', 5);
          query().where('myUnion', '==', new Date(5));
          // @ts-expect-error
          query().where('myUnion', '==', BigInt(5));
          // @ts-expect-error
          query().where('myUnion', '==', true);
          // @ts-expect-error
          query().where('myUnion', '==', []);
          // @ts-expect-error
          query().where('myUnion', '==', {});
          // @ts-expect-error
          query().where('myUnion', '==', null);
        });

        it('should support !=', () => {
          query().where('myUnion', '!=', 'value');
          query().where('myUnion', '!=', 5);
          query().where('myUnion', '!=', new Date(5));
          // @ts-expect-error
          query().where('myUnion', '!=', BigInt(5));
          // @ts-expect-error
          query().where('myUnion', '!=', true);
          // @ts-expect-error
          query().where('myUnion', '!=', []);
          // @ts-expect-error
          query().where('myUnion', '!=', {});
          // @ts-expect-error
          query().where('myUnion', '!=', null);
        });

        it('should support in', () => {
          query().where('myUnion', 'in', ['value']);
          query().where('myUnion', 'in', [5]);
          query().where('myUnion', 'in', [new Date(5)]);
          query().where('myUnion', 'in', ['value', 5, new Date(5)]);
          // @ts-expect-error
          query().where('myUnion', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myUnion', 'in', [true]);
          // @ts-expect-error
          query().where('myUnion', 'in', [[]]);
          // @ts-expect-error
          query().where('myUnion', 'in', [{}]);
          // @ts-expect-error
          query().where('myUnion', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myUnion', 'nin', ['value']);
          query().where('myUnion', 'nin', [5]);
          query().where('myUnion', 'nin', [new Date(5)]);
          query().where('myUnion', 'nin', ['value', 5, new Date(5)]);
          // @ts-expect-error
          query().where('myUnion', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myUnion', 'nin', [true]);
          // @ts-expect-error
          query().where('myUnion', 'nin', [[]]);
          // @ts-expect-error
          query().where('myUnion', 'nin', [{}]);
          // @ts-expect-error
          query().where('myUnion', 'nin', [null]);
        });

        it('should support regex', () => {
          query().where('myUnion', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myUnion', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myUnion', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myUnion', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myUnion', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myUnion', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myUnion', 'size', 5);
        });
      });
    });

    describe('optional properties', () => {
      describe('string', () => {
        it('should support ==', () => {
          query().where('myOptionalString', '==', 'value');
          query().where('myOptionalString', '==', null);
        });

        it('should support !=', () => {
          query().where('myOptionalString', '!=', 'value');
          query().where('myOptionalString', '!=', null);
        });

        it('should support in', () => {
          query().where('myOptionalString', 'in', ['value']);
          query().where('myOptionalString', 'in', [null]);
          query().where('myOptionalString', 'in', ['value', null]);
        });

        it('should support nin', () => {
          query().where('myOptionalString', 'nin', ['value']);
          query().where('myOptionalString', 'nin', [null]);
          query().where('myOptionalString', 'nin', ['value', null]);
        });

        it('should support regex', () => {
          query().where('myOptionalString', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalString', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalString', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalString', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalString', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalString', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalString', 'size', 5);
        });
      });

      describe('enum', () => {
        it('should support == only for a value matching the enum', () => {
          query().where('myOptionalEnum', '==', 'val1');
          query().where('myOptionalEnum', '==', 'val2');
          query().where('myOptionalEnum', '==', null);
          // @ts-expect-error
          query().where('myOptionalEnum', '==', 'value');
        });

        it('should support != only for a value matching the enum', () => {
          query().where('myOptionalEnum', '!=', 'val1');
          query().where('myOptionalEnum', '!=', 'val2');
          query().where('myOptionalEnum', '!=', null);
          // @ts-expect-error
          query().where('myOptionalEnum', '!=', 'value');
        });

        it('should support in only for a value matching the enum', () => {
          query().where('myOptionalEnum', 'in', ['val1']);
          query().where('myOptionalEnum', 'in', ['val2']);
          query().where('myOptionalEnum', 'in', [null]);
          query().where('myOptionalEnum', 'in', ['val1', null]);
          // @ts-expect-error
          query().where('myOptionalEnum', 'in', ['value']);
        });

        it('should support nin only for a value matching the enum', () => {
          query().where('myOptionalEnum', 'nin', ['val1']);
          query().where('myOptionalEnum', 'nin', ['val2']);
          query().where('myOptionalEnum', 'nin', [null]);
          query().where('myOptionalEnum', 'nin', ['val1', null]);
          // @ts-expect-error
          query().where('myOptionalEnum', 'nin', ['value']);
        });

        it('should support regex only for a value matching the enum', () => {
          query().where('myOptionalEnum', 'regex', /val/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalEnum', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalEnum', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalEnum', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalEnum', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalEnum', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalEnum', 'size', 5);
        });
      });

      describe('number', () => {
        it('should support ==', () => {
          query().where('myOptionalNumber', '==', 5);
          query().where('myOptionalNumber', '==', null);
        });

        it('should support !=', () => {
          query().where('myOptionalNumber', '!=', 5);
          query().where('myOptionalNumber', '!=', null);
        });

        it('should support in', () => {
          query().where('myOptionalNumber', 'in', [5]);
          query().where('myOptionalNumber', 'in', [null]);
          query().where('myOptionalNumber', 'in', [5, null]);
        });

        it('should support nin', () => {
          query().where('myOptionalNumber', 'nin', [5]);
          query().where('myOptionalNumber', 'nin', [null]);
          query().where('myOptionalNumber', 'nin', [5, null]);
        });

        it('should support >', () => {
          query().where('myOptionalNumber', '>', 5);
          // @ts-expect-error
          query().where('myOptionalNumber', '>', null);
        });

        it('should support >=', () => {
          query().where('myOptionalNumber', '>=', 5);
          // @ts-expect-error
          query().where('myOptionalNumber', '>=', null);
        });

        it('should support <', () => {
          query().where('myOptionalNumber', '<', 5);
          // @ts-expect-error
          query().where('myOptionalNumber', '<', null);
        });

        it('should support <=', () => {
          query().where('myOptionalNumber', '<=', 5);
          // @ts-expect-error
          query().where('myOptionalNumber', '<=', null);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalNumber', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalNumber', 'all', [5]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalNumber', 'size', 5);
        });
      });

      describe('bigInt', () => {
        it('should support ==', () => {
          query().where('myOptionalBigInt', '==', BigInt(5));
          query().where('myOptionalBigInt', '==', null);
        });

        it('should support !=', () => {
          query().where('myOptionalBigInt', '!=', BigInt(5));
          query().where('myOptionalBigInt', '!=', null);
        });

        it('should support in', () => {
          query().where('myOptionalBigInt', 'in', [BigInt(5)]);
          query().where('myOptionalBigInt', 'in', [null]);
          query().where('myOptionalBigInt', 'in', [BigInt(5), null]);
        });

        it('should support nin', () => {
          query().where('myOptionalBigInt', 'nin', [BigInt(5)]);
          query().where('myOptionalBigInt', 'nin', [null]);
          query().where('myOptionalBigInt', 'nin', [BigInt(5), null]);
        });

        it('should support >', () => {
          query().where('myOptionalBigInt', '>', BigInt(5));
          // @ts-expect-error
          query().where('myOptionalBigInt', '>', null);
        });

        it('should support >=', () => {
          query().where('myOptionalBigInt', '>=', BigInt(5));
          // @ts-expect-error
          query().where('myOptionalBigInt', '>=', null);
        });

        it('should support <', () => {
          query().where('myOptionalBigInt', '<', BigInt(5));
          // @ts-expect-error
          query().where('myOptionalBigInt', '<', null);
        });

        it('should support <=', () => {
          query().where('myOptionalBigInt', '<=', BigInt(5));
          // @ts-expect-error
          query().where('myOptionalBigInt', '<=>', null);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalBigInt', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalBigInt', 'all', [BigInt(5)]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalBigInt', 'size', 5);
        });
      });

      describe('date', () => {
        it('should support ==', () => {
          query().where('myOptionalDate', '==', new Date(5));
          query().where('myOptionalDate', '==', null);
        });

        it('should support !=', () => {
          query().where('myOptionalDate', '!=', new Date(5));
          query().where('myOptionalDate', '!=', null);
        });

        it('should support in', () => {
          query().where('myOptionalDate', 'in', [new Date(5)]);
          query().where('myOptionalDate', 'in', [null]);
          query().where('myOptionalDate', 'in', [new Date(5), null]);
        });

        it('should support nin', () => {
          query().where('myOptionalDate', 'nin', [new Date(5)]);
          query().where('myOptionalDate', 'nin', [null]);
          query().where('myOptionalDate', 'nin', [new Date(5), null]);
        });

        it('should support >', () => {
          query().where('myOptionalDate', '>', new Date(5));
          // @ts-expect-error
          query().where('myOptionalDate', '>', null);
        });

        it('should support >=', () => {
          query().where('myOptionalDate', '>=', new Date(5));
          // @ts-expect-error
          query().where('myOptionalDate', '>=', null);
        });

        it('should support <', () => {
          query().where('myOptionalDate', '<', new Date(5));
          // @ts-expect-error
          query().where('myOptionalDate', '<', null);
        });

        it('should support <=', () => {
          query().where('myOptionalDate', '<=', new Date(5));
          // @ts-expect-error
          query().where('myOptionalDate', '<=', null);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalDate', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalDate', 'all', [new Date(5)]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalDate', 'size', 5);
        });
      });

      describe('boolean', () => {
        it('should support ==', () => {
          query().where('myOptionalBoolean', '==', true);
          query().where('myOptionalBoolean', '==', null);
        });

        it('should support !=', () => {
          query().where('myOptionalBoolean', '!=', true);
          query().where('myOptionalBoolean', '!=', null);
        });

        it('should support in', () => {
          query().where('myOptionalBoolean', 'in', [true]);
          query().where('myOptionalBoolean', 'in', [null]);
          query().where('myOptionalBoolean', 'in', [true, null]);
        });

        it('should support nin', () => {
          query().where('myOptionalBoolean', 'nin', [true]);
          query().where('myOptionalBoolean', 'nin', [null]);
          query().where('myOptionalBoolean', 'nin', [true, null]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', 'all', [true]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalBoolean', 'size', 5);
        });
      });

      describe('null', () => {
        it('should support ==', () => {
          query().where('myOptionalNull', '==', null);
        });

        it('should support !=', () => {
          query().where('myOptionalNull', '!=', null);
        });

        it('should support in', () => {
          query().where('myOptionalNull', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myOptionalNull', 'nin', [null]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalNull', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalNull', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalNull', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalNull', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalNull', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalNull', 'all', [null]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalNull', 'size', 5);
        });
      });

      describe('array', () => {
        it('should support in only for a type matching the schema', () => {
          query().where('myOptionalArray', 'in', ['value']);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [null]);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [5]);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [true]);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [new Date(5)]);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [[]]);
          // @ts-expect-error
          query().where('myOptionalArray', 'in', [{}]);
        });

        it('should support nin only for a type matching the schema', () => {
          query().where('myOptionalArray', 'nin', ['value']);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [null]);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [5]);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [true]);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [new Date(5)]);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [[]]);
          // @ts-expect-error
          query().where('myOptionalArray', 'nin', [{}]);
        });

        it('should support all only for a type matching the schema', () => {
          query().where('myOptionalArray', 'all', ['value']);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [5]);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [true]);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [new Date(5)]);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [BigInt(5)]);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [null]);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [[]]);
          // @ts-expect-error
          query().where('myOptionalArray', 'all', [{}]);
        });

        it('should support size', () => {
          query().where('myOptionalArray', 'size', 5);
        });

        it('should not support ==', () => {
          // @ts-expect-error
          query().where('myOptionalArray', '==', ['value']);
        });

        it('should not support !=', () => {
          // @ts-expect-error
          query().where('myOptionalArray', '!=', ['value']);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalArray', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalArray', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalArray', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalArray', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalArray', '<=', 5);
        });
      });

      describe('object', () => {
        it('should support ==', () => {
          query().where('myOptionalObject', '==', { nested: 'value' });
          query().where('myOptionalObject', '==', {});
          query().where('myOptionalObject', '==', null);
          // @ts-expect-error
          query().where('myOptionalObject', '==', { unknown: 'value' });
        });

        it('should support !=', () => {
          query().where('myOptionalObject', '!=', { nested: 'value' });
          query().where('myOptionalObject', '!=', {});
          query().where('myOptionalObject', '!=', null);
          // @ts-expect-error
          query().where('myOptionalObject', '!=', { unknown: 'value' });
        });

        it('should support in', () => {
          query().where('myOptionalObject', 'in', [{ nested: 'value' }]);
          query().where('myOptionalObject', 'in', [{}]);
          query().where('myOptionalObject', 'in', [null]);
          // @ts-expect-error
          query().where('myOptionalObject', 'in', [{ unknown: 'value' }]);
        });

        it('should support nin', () => {
          query().where('myOptionalObject', 'nin', [{ nested: 'value' }]);
          query().where('myOptionalObject', 'nin', [{}]);
          query().where('myOptionalObject', 'nin', [null]);
          // @ts-expect-error
          query().where('myOptionalObject', 'nin', [{ unknown: 'value' }]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myOptionalObject', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalObject', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalObject', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalObject', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalObject', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalObject', 'all', [true]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalObject', 'size', 5);
        });
      });

      describe('union', () => {
        it('should support ==', () => {
          query().where('myOptionalUnion', '==', 'value');
          query().where('myOptionalUnion', '==', 5);
          query().where('myOptionalUnion', '==', new Date(5));
          query().where('myOptionalUnion', '==', null);
          // @ts-expect-error
          query().where('myOptionalUnion', '==', BigInt(5));
          // @ts-expect-error
          query().where('myOptionalUnion', '==', true);
          // @ts-expect-error
          query().where('myOptionalUnion', '==', []);
          // @ts-expect-error
          query().where('myOptionalUnion', '==', {});
        });

        it('should support !=', () => {
          query().where('myOptionalUnion', '!=', 'value');
          query().where('myOptionalUnion', '!=', 5);
          query().where('myOptionalUnion', '!=', new Date(5));
          query().where('myOptionalUnion', '!=', null);
          // @ts-expect-error
          query().where('myOptionalUnion', '!=', BigInt(5));
          // @ts-expect-error
          query().where('myOptionalUnion', '!=', true);
          // @ts-expect-error
          query().where('myOptionalUnion', '!=', []);
          // @ts-expect-error
          query().where('myOptionalUnion', '!=', {});
        });

        it('should support in', () => {
          query().where('myOptionalUnion', 'in', ['value']);
          query().where('myOptionalUnion', 'in', [5]);
          query().where('myOptionalUnion', 'in', [new Date(5)]);
          query().where('myOptionalUnion', 'in', [null]);
          query().where('myOptionalUnion', 'in', [null, 'value', 5, new Date(5)]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'in', [true]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'in', [[]]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'in', [{}]);
        });

        it('should support nin', () => {
          query().where('myOptionalUnion', 'nin', ['value']);
          query().where('myOptionalUnion', 'nin', [5]);
          query().where('myOptionalUnion', 'nin', [new Date(5)]);
          query().where('myOptionalUnion', 'nin', [null]);
          query().where('myOptionalUnion', 'nin', [null, 'value', 5, new Date(5)]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'nin', [true]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'nin', [[]]);
          // @ts-expect-error
          query().where('myOptionalUnion', 'nin', [{}]);
        });

        it('should support regex', () => {
          query().where('myOptionalUnion', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myOptionalUnion', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myOptionalUnion', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myOptionalUnion', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myOptionalUnion', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myOptionalUnion', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myOptionalUnion', 'size', 5);
        });
      });
    });

    describe('default properties', () => {
      describe('string', () => {
        it('should support ==', () => {
          query().where('myDefaultString', '==', 'value');
          // @ts-expect-error
          query().where('myDefaultString', '==', null);
        });

        it('should support !=', () => {
          query().where('myDefaultString', '!=', 'value');
          // @ts-expect-error
          query().where('myDefaultString', '!=', null);
        });

        it('should support in', () => {
          query().where('myDefaultString', 'in', ['value']);
          // @ts-expect-error
          query().where('myDefaultString', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myDefaultString', 'nin', ['value']);
          // @ts-expect-error
          query().where('myDefaultString', 'nin', [null]);
        });

        it('should support regex', () => {
          query().where('myDefaultString', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultString', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultString', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultString', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultString', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultString', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultString', 'size', 5);
        });
      });

      describe('enum', () => {
        it('should support == only for a value matching the enum', () => {
          query().where('myDefaultEnum', '==', 'val1');
          query().where('myDefaultEnum', '==', 'val2');
          // @ts-expect-error
          query().where('myDefaultEnum', '==', null);
          // @ts-expect-error
          query().where('myDefaultEnum', '==', 'value');
        });

        it('should support != only for a value matching the enum', () => {
          query().where('myDefaultEnum', '!=', 'val1');
          query().where('myDefaultEnum', '!=', 'val2');
          // @ts-expect-error
          query().where('myDefaultEnum', '!=', null);
          // @ts-expect-error
          query().where('myDefaultEnum', '!=', 'value');
        });

        it('should support in only for a value matching the enum', () => {
          query().where('myDefaultEnum', 'in', ['val1']);
          query().where('myDefaultEnum', 'in', ['val2']);
          // @ts-expect-error
          query().where('myDefaultEnum', 'in', [null]);
          // @ts-expect-error
          query().where('myDefaultEnum', 'in', ['value']);
        });

        it('should support nin only for a value matching the enum', () => {
          query().where('myDefaultEnum', 'nin', ['val1']);
          query().where('myDefaultEnum', 'nin', ['val2']);
          // @ts-expect-error
          query().where('myDefaultEnum', 'nin', [null]);
          // @ts-expect-error
          query().where('myDefaultEnum', 'nin', ['value']);
        });

        it('should support regex only for a value matching the enum', () => {
          query().where('myDefaultEnum', 'regex', /val/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultEnum', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultEnum', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultEnum', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultEnum', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultEnum', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultEnum', 'size', 5);
        });
      });

      describe('number', () => {
        it('should support ==', () => {
          query().where('myDefaultNumber', '==', 5);
          // @ts-expect-error
          query().where('myDefaultNumber', '==', null);
        });

        it('should support !=', () => {
          query().where('myDefaultNumber', '!=', 5);
          // @ts-expect-error
          query().where('myDefaultNumber', '!=', null);
        });

        it('should support in', () => {
          query().where('myDefaultNumber', 'in', [5]);
          // @ts-expect-error
          query().where('myDefaultNumber', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myDefaultNumber', 'nin', [5]);
          // @ts-expect-error
          query().where('myDefaultNumber', 'nin', [null]);
        });

        it('should support >', () => {
          query().where('myDefaultNumber', '>', 5);
          // @ts-expect-error
          query().where('myDefaultNumber', '>', null);
        });

        it('should support >=', () => {
          query().where('myDefaultNumber', '>=', 5);
          // @ts-expect-error
          query().where('myDefaultNumber', '>=', null);
        });

        it('should support <', () => {
          query().where('myDefaultNumber', '<', 5);
          // @ts-expect-error
          query().where('myDefaultNumber', '<', null);
        });

        it('should support <=', () => {
          query().where('myDefaultNumber', '<=', 5);
          // @ts-expect-error
          query().where('myDefaultNumber', '<=', null);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultNumber', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultNumber', 'all', [5]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultNumber', 'size', 5);
        });
      });

      describe('bigInt', () => {
        it('should support ==', () => {
          query().where('myDefaultBigInt', '==', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultBigInt', '==', null);
        });

        it('should support !=', () => {
          query().where('myDefaultBigInt', '!=', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultBigInt', '!=', null);
        });

        it('should support in', () => {
          query().where('myDefaultBigInt', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultBigInt', 'in', null);
        });

        it('should support nin', () => {
          query().where('myDefaultBigInt', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultBigInt', 'nin', null);
        });

        it('should support >', () => {
          query().where('myDefaultBigInt', '>', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultBigInt', '>', null);
        });

        it('should support >=', () => {
          query().where('myDefaultBigInt', '>=', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultBigInt', '>=', null);
        });

        it('should support <', () => {
          query().where('myDefaultBigInt', '<', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultBigInt', '<', null);
        });

        it('should support <=', () => {
          query().where('myDefaultBigInt', '<=', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultBigInt', '<=>', null);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultBigInt', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultBigInt', 'all', [BigInt(5)]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultBigInt', 'size', 5);
        });
      });

      describe('date', () => {
        it('should support ==', () => {
          query().where('myDefaultDate', '==', new Date(5));
          // @ts-expect-error
          query().where('myDefaultDate', '==', null);
        });

        it('should support !=', () => {
          query().where('myDefaultDate', '!=', new Date(5));
          // @ts-expect-error
          query().where('myDefaultDate', '!=', null);
        });

        it('should support in', () => {
          query().where('myDefaultDate', 'in', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultDate', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myDefaultDate', 'nin', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultDate', 'nin', [null]);
        });

        it('should support >', () => {
          query().where('myDefaultDate', '>', new Date(5));
          // @ts-expect-error
          query().where('myDefaultDate', '>', null);
        });

        it('should support >=', () => {
          query().where('myDefaultDate', '>=', new Date(5));
          // @ts-expect-error
          query().where('myDefaultDate', '>=', null);
        });

        it('should support <', () => {
          query().where('myDefaultDate', '<', new Date(5));
          // @ts-expect-error
          query().where('myDefaultDate', '<', null);
        });

        it('should support <=', () => {
          query().where('myDefaultDate', '<=', new Date(5));
          // @ts-expect-error
          query().where('myDefaultDate', '<=', null);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultDate', 'regex', /value/i);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultDate', 'all', [new Date(5)]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultDate', 'size', 5);
        });
      });

      describe('boolean', () => {
        it('should support ==', () => {
          query().where('myDefaultBoolean', '==', true);
          // @ts-expect-error
          query().where('myDefaultBoolean', '==', null);
        });

        it('should support !=', () => {
          query().where('myDefaultBoolean', '!=', true);
          // @ts-expect-error
          query().where('myDefaultBoolean', '!=', null);
        });

        it('should support in', () => {
          query().where('myDefaultBoolean', 'in', [true]);
          // @ts-expect-error
          query().where('myDefaultBoolean', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myDefaultBoolean', 'nin', [true]);
          // @ts-expect-error
          query().where('myDefaultBoolean', 'nin', [null]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', 'all', [true]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultBoolean', 'size', 5);
        });
      });

      describe('null', () => {
        it('should support ==', () => {
          query().where('myDefaultNull', '==', null);
        });

        it('should support !=', () => {
          query().where('myDefaultNull', '!=', null);
        });

        it('should support in', () => {
          query().where('myDefaultNull', 'in', [null]);
        });

        it('should support nin', () => {
          query().where('myDefaultNull', 'nin', [null]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultNull', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultNull', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultNull', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultNull', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultNull', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultNull', 'all', [null]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultNull', 'size', 5);
        });
      });

      describe('array', () => {
        it('should support in only for a type matching the schema', () => {
          query().where('myDefaultArray', 'in', ['value']);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [5]);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [true]);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [null]);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [[]]);
          // @ts-expect-error
          query().where('myDefaultArray', 'in', [{}]);
        });

        it('should support nin only for a type matching the schema', () => {
          query().where('myDefaultArray', 'nin', ['value']);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [5]);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [true]);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [null]);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [[]]);
          // @ts-expect-error
          query().where('myDefaultArray', 'nin', [{}]);
        });

        it('should support all only for a type matching the schema', () => {
          query().where('myDefaultArray', 'all', ['value']);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [5]);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [true]);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [null]);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [[]]);
          // @ts-expect-error
          query().where('myDefaultArray', 'all', [{}]);
        });

        it('should support size', () => {
          query().where('myDefaultArray', 'size', 5);
        });

        it('should not support ==', () => {
          // @ts-expect-error
          query().where('myDefaultArray', '==', ['value']);
        });

        it('should not support !=', () => {
          // @ts-expect-error
          query().where('myDefaultArray', '!=', ['value']);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultArray', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultArray', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultArray', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultArray', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultArray', '<=', 5);
        });
      });

      describe('object', () => {
        it('should support ==', () => {
          query().where('myDefaultObject', '==', { nested: 'value' });
          // @ts-expect-error
          query().where('myDefaultObject', '==', null);
          // @ts-expect-error
          query().where('myDefaultObject', '==', {});
          // @ts-expect-error
          query().where('myDefaultObject', '==', { unknown: 'value' });
        });

        it('should support !=', () => {
          query().where('myDefaultObject', '!=', { nested: 'value' });
          // @ts-expect-error
          query().where('myDefaultObject', '!=', null);
          // @ts-expect-error
          query().where('myDefaultObject', '!=', {});
          // @ts-expect-error
          query().where('myDefaultObject', '!=', { unknown: 'value' });
        });

        it('should support in', () => {
          query().where('myDefaultObject', 'in', [{ nested: 'value' }]);
          // @ts-expect-error
          query().where('myDefaultObject', 'in', [null]);
          // @ts-expect-error
          query().where('myDefaultObject', 'in', [{}]);
          // @ts-expect-error
          query().where('myDefaultObject', 'in', [{ unknown: 'value' }]);
        });

        it('should support nin', () => {
          query().where('myDefaultObject', 'nin', [{ nested: 'value' }]);
          // @ts-expect-error
          query().where('myDefaultObject', 'nin', [null]);
          // @ts-expect-error
          query().where('myDefaultObject', 'nin', [{}]);
          // @ts-expect-error
          query().where('myDefaultObject', 'nin', [{ unknown: 'value' }]);
        });

        it('should not support regex', () => {
          // @ts-expect-error
          query().where('myDefaultObject', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultObject', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultObject', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultObject', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultObject', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultObject', 'all', [true]);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultObject', 'size', 5);
        });
      });

      describe('union', () => {
        it('should support ==', () => {
          query().where('myDefaultUnion', '==', 'value');
          query().where('myDefaultUnion', '==', 5);
          query().where('myDefaultUnion', '==', new Date(5));
          // @ts-expect-error
          query().where('myDefaultUnion', '==', null);
          // @ts-expect-error
          query().where('myDefaultUnion', '==', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultUnion', '==', true);
          // @ts-expect-error
          query().where('myDefaultUnion', '==', []);
          // @ts-expect-error
          query().where('myDefaultUnion', '==', {});
        });

        it('should support !=', () => {
          query().where('myDefaultUnion', '!=', 'value');
          query().where('myDefaultUnion', '!=', 5);
          query().where('myDefaultUnion', '!=', new Date(5));
          // @ts-expect-error
          query().where('myDefaultUnion', '!=', null);
          // @ts-expect-error
          query().where('myDefaultUnion', '!=', BigInt(5));
          // @ts-expect-error
          query().where('myDefaultUnion', '!=', true);
          // @ts-expect-error
          query().where('myDefaultUnion', '!=', []);
          // @ts-expect-error
          query().where('myDefaultUnion', '!=', {});
        });

        it('should support in', () => {
          query().where('myDefaultUnion', 'in', ['value']);
          query().where('myDefaultUnion', 'in', [5]);
          query().where('myDefaultUnion', 'in', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'in', [null]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'in', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'in', [true]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'in', [[]]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'in', [{}]);
        });

        it('should support nin', () => {
          query().where('myDefaultUnion', 'nin', ['value']);
          query().where('myDefaultUnion', 'nin', [5]);
          query().where('myDefaultUnion', 'nin', [new Date(5)]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'nin', [null]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'nin', [BigInt(5)]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'nin', [true]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'nin', [[]]);
          // @ts-expect-error
          query().where('myDefaultUnion', 'nin', [{}]);
        });

        it('should support regex', () => {
          query().where('myDefaultUnion', 'regex', /value/i);
        });

        it('should not support >', () => {
          // @ts-expect-error
          query().where('myDefaultUnion', '>', 5);
        });

        it('should not support >=', () => {
          // @ts-expect-error
          query().where('myDefaultUnion', '>=', 5);
        });

        it('should not support <', () => {
          // @ts-expect-error
          query().where('myDefaultUnion', '<', 5);
        });

        it('should not support <=', () => {
          // @ts-expect-error
          query().where('myDefaultUnion', '<=', 5);
        });

        it('should not support all', () => {
          // @ts-expect-error
          query().where('myDefaultUnion', 'all', ['value']);
        });

        it('should not support size', () => {
          // @ts-expect-error
          query().where('myDefaultUnion', 'size', 5);
        });
      });
    });
  });
});
