import { compact } from './compact';

describe('compact', () => {
  it('should return an array without nullish values', () => {
    const array = ['some', null, '', 0, false, true, undefined, 69];

    const result = compact(array);

    expect(result).toEqual(['some', '', 0, false, true, 69]);
  });
});
