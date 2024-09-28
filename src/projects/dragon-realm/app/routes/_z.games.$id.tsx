import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { tryit } from 'radash';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { GameScreen } from '~/components/organisms/GameScreen';
import { game } from '~/game';
import { GameProvider } from '~/contexts';
import { DB } from '~/database';
import { GameHeader } from '~/components/organisms/GameHeader';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dragon Realm' },
    { name: 'description', content: 'Dragon Realm' },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [error, save] = await tryit(DB.save.findById)(params.id || '');

  if (save) {
    const currentArea = save.currentArea
      ? await game.area.findById(save.currentArea)
      : undefined;

    const currentLocation = currentArea && save.currentLocation
      ? currentArea.locations.find(location => location.id === save.currentLocation)
      : undefined;

    return {
      ...save,
      currentArea,
      currentLocation,
    };
  }

  // if the error is a cast error then the ID provided is invalid and will not exist in DB
  if (error && (!(error instanceof Error) || !error.message.toLowerCase().includes('cast'))) {
    throw error;
  }

  throw json({ message: 'Save not found' }, { status: 404 });
}

const queryClient = new QueryClient();

export default function Game() {
  const save = useLoaderData<typeof loader>();

  // the height is that of the screen minus the padding top
  // so that the game interface can take all the space available
  return (
    <GameProvider save={save}>
      <QueryClientProvider client={queryClient}>
        <div className="w-full flex flex-col gap-6 items-center pb-5" style={{ height: 'calc(100vh - 5rem)' }}>
          <GameHeader />
          <GameScreen />
        </div>
      </QueryClientProvider>
    </GameProvider>
  );
}
