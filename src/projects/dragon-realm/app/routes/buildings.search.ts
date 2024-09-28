import { json, type LoaderFunctionArgs } from '@remix-run/node';

import { DB } from '~/database';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    throw new Error('Missing id parameter');
  }

  const building = await DB.area.findBuildingById(id);

  if (!building) {
    throw json({ message: 'Building not found' }, { status: 404 })
  }

  return building;
}
