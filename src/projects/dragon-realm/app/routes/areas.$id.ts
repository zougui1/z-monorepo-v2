import { json, type LoaderFunctionArgs } from '@remix-run/node';

import { DB } from '~/database';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Error('Missing id parameter');
  }

  console.time('find area')
  const area = await DB.area.findByObjectId(params.id);
  console.timeEnd('find area')

  if (!area) {
    throw json({ message: 'Area not found' }, { status: 404 })
  }

  return area;
}
