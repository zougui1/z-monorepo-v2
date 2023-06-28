import zod from 'zod';
import { json, type V2_MetaFunction, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Workout } from '~/features/workout/components/Workout';
import { getDef, getFieldsDefaultValue } from '~/utils';

const schema = zod.object({
  name: zod.string().min(4).max(5).email(),
  toto: zod.literal('hah'),
  bigInt: zod.bigint(),
  record: zod.record(zod.number(), zod.string()),
  address: zod.object({
    city: zod.string(),
  }).default({ city: 'Berlin' }),
  num: zod.union([zod.string(), zod.number(), zod.boolean()]),
  tuple: zod.tuple([zod.string(), zod.number()]),
  lazy: zod.lazy(() => zod.string()),
  func: zod.function(zod.tuple([zod.string()]), zod.number())
});
const def = getDef(schema);
const defaultValues = getFieldsDefaultValue(def);

//console.log('def', def);
//console.log('defaultValues', defaultValues);

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Workout' }];
};

export const loader = ({ params }: LoaderArgs) => {
  if (!params.id) {
    throw new Error('no id');
  }

  return json({
    id: params.id,
  });
}

export default function WorkoutScreen() {
  const data = useLoaderData<typeof loader>();

  return (
    <Workout />
  );
}
