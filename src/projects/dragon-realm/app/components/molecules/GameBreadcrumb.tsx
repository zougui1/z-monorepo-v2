import { Fragment } from 'react';

import { useGame, useGameState } from '~/contexts';
import { Breadcrumb } from '~/components/molecules/Breadcrumb';
import type { Game } from '~/game';

const getBreadcrumbItems = (game: Game): string[] => {
  const items: string[] = [];

  if (game.currentLocation) {
    items.push(game.currentLocation.name);
  } else {
    items.push('Wilderness');
  }

  if (game.currentBuilding) {
    items.push(game.currentBuilding.name);
  }

  return items;
}

export const GameBreadcrumb = () => {
  const game = useGame();
  // update the breadcrumb when the game's state changes
  useGameState();
  const items = getBreadcrumbItems(game);

  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {items.map((item, index) => (
          <Fragment key={item}>
            <Breadcrumb.Item>
              {index < (items.length - 1) ? item : (
                <Breadcrumb.Page>{item}</Breadcrumb.Page>
              )}
            </Breadcrumb.Item>

            {index < (items.length - 1) && <Breadcrumb.Separator />}
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
