import * as abilities from './abilities';
import * as armors from './armors';
import * as rings from './rings';
import * as weapons from './weapons';
import * as marks from './marks';
import * as dungeonUnlockers from './dungeonUnlockers';
import * as shards from './shards';
import * as forgeTokens from './forgeTokens';
import * as lores from './lores';
import * as drakeEggs from './drakeEggs';
import * as misc from './misc';
import { flattenItems } from './utils';
import type { FullItemObject } from './types';

export const items = {
  abilities,
  armors,
  rings,
  weapons,
  marks,
  dungeonUnlockers,
  shards,
  forgeTokens,
  lores,
  drakeEggs,
  misc,
};

export const flatItems = flattenItems(items as unknown as FullItemObject);
