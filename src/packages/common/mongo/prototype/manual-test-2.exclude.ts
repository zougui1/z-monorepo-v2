import { z } from './schema-v2';
import { Connection } from './connection';

(async () => {
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
    const db = new Connection('mongodb://127.0.0.1:27017/test');
    const Test = db.createModel('tests', schema);
    return Test.query();
  }

  const result = await query()
    .whereOr(
      subQuery => subQuery.whereType('things', 'number'),
      subQuery => subQuery.whereType('things', 'string'),
    )
    .not(subQuery => subQuery
      .whereType('age', 'number')
      .whereNotNull('address')
      .peekSchema(schema => schema._shape.age)
    )
    .select(['age', 'things', 'address'])
    .whereOr(
      subQuery => subQuery.whereType('things', 'number'),
      subQuery => subQuery.whereType('things', 'string'),
    )
    .not(subQuery => subQuery
      .whereType('age', 'number')
      .whereNotNull('address')
      .peekSchema(schema => schema._shape.age)
    )
    .select(['age', 'things', 'address'])
    .whereOr(
      subQuery => subQuery.whereType('things', 'number'),
      subQuery => subQuery.whereType('things', 'string'),
    )
    .not(subQuery => subQuery
      .whereType('age', 'number')
      .whereNotNull('address')
      .peekSchema(schema => schema._shape.age)
    )
    .select(['age', 'things', 'address'])
    .whereOr(
      subQuery => subQuery.whereType('things', 'number'),
      subQuery => subQuery.whereType('things', 'string'),
    )
    .not(subQuery => subQuery
      .whereType('age', 'number')
      .whereNotNull('address')
      .peekSchema(schema => schema._shape.age)
    )
    .select(['age', 'things', 'address'])
    .whereOr(
      subQuery => subQuery.whereType('things', 'number'),
      subQuery => subQuery.whereType('things', 'string'),
    )
    .not(subQuery => subQuery
      .whereType('age', 'number')
      .whereNotNull('address')
      .peekSchema(schema => schema._shape.age)
    )
    .select(['age', 'things', 'address'])
    .whereOr(
      subQuery => subQuery.whereType('things', 'number'),
      subQuery => subQuery.whereType('things', 'string'),
    )
    .not(subQuery => subQuery
      .whereType('age', 'number')
      .whereNotNull('address')
      .peekSchema(schema => schema._shape.age)
    )
    .select(['age', 'things', 'address'])
    .find();
})();
