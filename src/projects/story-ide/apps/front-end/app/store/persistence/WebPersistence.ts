import { get, set, del } from 'idb-keyval';

import type { Persistence } from './Persistence';
import type { AppState } from '../store';

const key = 'state';

export class WebPersistence implements Persistence {
  get = async (): Promise<AppState | undefined> => {
    // TODO validate the state
    return await get(key);
  }

  set = async (state: AppState): Promise<void> => {
    await set(key, state);
  }

  delete = async (): Promise<void> => {
    await del(key);
  }
}
