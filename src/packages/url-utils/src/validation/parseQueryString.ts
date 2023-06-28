import QS from 'qs';
import zod, { AnyZodObject } from 'zod';

export const parseQueryString = <Schema extends AnyZodObject>(url: string, schema: Schema): zod.infer<Schema> => {
  const urlObject = new URL(url);
  const queryObject = QS.parse(urlObject.search, {
    ignoreQueryPrefix: true,
  });

  return schema.parse(queryObject);
}
