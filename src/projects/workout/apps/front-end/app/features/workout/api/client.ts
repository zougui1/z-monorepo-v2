import { createAlova } from 'alova';

import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from 'alova/react';

/*export const createClient = async () => {
  const GlobalFetch = await import('alova/GlobalFetch');
  const ReactHook = await import('alova/react');

  return createAlova({
    baseURL: 'http://localhost:8000',
    requestAdapter: GlobalFetch(),
    statesHook: ReactHook,
    responded: response => response.json(),
  });
}*/

export const client = createAlova({
  baseURL: 'http://localhost:8000',
  requestAdapter: GlobalFetch(),
  statesHook: ReactHook,
  responded: response => response.json(),
});
