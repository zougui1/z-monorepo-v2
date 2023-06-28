import zod from 'zod';

import { parseQueryString } from './parseQueryString';

describe('parseQueryString', () => {
  it('should correctly parse the query string when it is valid', () => {
    const url = 'https://zougui.com?search=some string&num=69&arr[]=42';
    const schema = zod.object({
      search: zod.string(),
      num: zod.coerce.number(),
      arr: zod.array(zod.coerce.number()),
    });

    const result = parseQueryString(url, schema);

    expect(result).toEqual({
      search: 'some string',
      num: 69,
      arr: [42],
    });
  });

  it('should throw an error when the query string does not correspond to the schema', () => {
    const url = 'https://zougui.com?search[]=oh no&num=toto&arr=uazg';
    const schema = zod.object({
      search: zod.string(),
      num: zod.coerce.number(),
      arr: zod.array(zod.coerce.number()),
    });

    const getResult = () => parseQueryString(url, schema);

    expect(getResult).toThrowError();
  });
});
