import type { AxiosInstance } from 'axios';

import { mapObject } from '@zougui/common.object-utils';
import { joinUrl } from '@zougui/common.url-utils';
import type { AnyRouterData } from '@zougui/common.ts-rest.core';

import { contractToRequest } from './contractToRequest';
import type { InferRouter, InferRouters, InferContracts } from './InferContract';

export const convertRouter = <T extends AnyRouterData>(axios: AxiosInstance, router: T): InferRouter<T> => {
  const subRouters = mapObject(router.routers, subRouter => {
    return convertRouter(axios, {
      ...subRouter,
      path: joinUrl(router.path, subRouter.path),
    });
  }) as InferRouters<T>;

  const contracts = mapObject(router.contracts, contract => {
    return contractToRequest(axios, {
      ...contract,
      path: joinUrl(router.path, contract.path),
    });
  }) as InferContracts<T>;

  return {
    ...subRouters,
    ...contracts,
  };
}
