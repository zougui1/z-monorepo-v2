import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { Typography } from '~/components/atoms/Typography';
import { DB } from '~/database';
import { LinkButton } from '~/components/atoms/LinkButton';
import { MAX_SAVE_COUNT } from '~/game/constants';
import { SaveItem } from '~/components/molecules/SaveItem';
import { Divider } from '~/components/atoms/Divider';
import { Select } from '~/components/molecules/Select';
import { Dropdown } from '~/components/molecules/Dropdown';

export const meta: MetaFunction = () => {
  return [
    { title: 'Saves - Dragon Realm' },
    { name: 'description', content: 'Saves menu' },
  ];
};

export const loader = async () => {
  return await DB.save.find();
}

export default function Saves() {
  const saves = useLoaderData<typeof loader>();

  return (
    <>
      <Typography variant="h1" className="pb-4">Games</Typography>

      {saves.length === 0 && (
        <Typography>No games saved</Typography>
      )}

      <Dropdown.Root open>
        <Dropdown.Trigger className="always-open hidden"></Dropdown.Trigger>

        <Dropdown.Content  className="w-[600px] space-y-2">
          {saves.map((save, index) => (
            <Fragment key={save._id}>
              <Dropdown.Item asChild>
                <Link to={`/games/${save._id}`}>
                  <SaveItem save={save} />
                </Link>
              </Dropdown.Item>

              {index < saves.length && (
                <Divider />
              )}
            </Fragment>
          ))}

          <Dropdown.Item asChild className="flex justify-center">
            <Link to="/new-game">
              <Typography>New Game</Typography>
            </Link>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
