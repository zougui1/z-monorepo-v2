import { pick } from './pick';

describe('pick', () => {
  it('should return an empty object when selecting no keys', () => {
    const obj = {
      name: 'Zougui',
      species: 'Dragon',
    } as const;

    const result = pick(obj, []);

    expect(result).toEqual({});
  });

  it('should return an object with the selected keys', () => {
    const obj = {
      name: 'Zougui',
      species: 'Dragon',
      state: 'horny',
    } as const;

    const result = pick(obj, ['name', 'species']);

    expect(result).toEqual({
      name: 'Zougui',
      species: 'Dragon',
    });
  });
});
