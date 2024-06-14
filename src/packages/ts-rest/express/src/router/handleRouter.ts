import type { AnyRouterData } from '@zougui/common.ts-rest.core';

import type { HandledRouter, HandledRouters, HandledContracts } from './HandledRouter';
import type { ContractHandler, ContractEntry } from '../contract';

export function handleRouter<Router extends AnyRouterData>(router: Router, handlers: HandlersForRouter<Router>): HandledRouter<Router> {
  const subRoutersHandlers: HandledRouters<Router> = {} as HandledRouters<Router>;
  const contractHandlers: HandledContracts<Router> = {} as HandledContracts<Router>;

  for (const [name, subRouter] of Object.entries(router.routers) as RouterEntry<Router>[]) {
    if (!('routers' in handlers) || !(name in handlers.routers)) {
      throw new Error(`Missing handler for router ${router.path}/${subRouter.path}`);
    }

    subRoutersHandlers[name] = handlers.routers[name];
  }

  for (const [name, contract] of Object.entries(router.contracts) as ContractEntry<Router>[]) {
    if ('contracts' in handlers && name in handlers.contracts) {
      (contractHandlers as any)[name] = {
        ...contract,
        handler: handlers.contracts[name],
      };
    }
  }

  return {
    ...router,
    routers: subRoutersHandlers,
    contracts: contractHandlers,
  };
}

export type HandlersForContracts<Router extends AnyRouterData> = {
  [Key in keyof Router['contracts']]: ContractHandler<Router['contracts'][Key]>;
};

export type HandlersForRouter<Router extends AnyRouterData> = (
  // do not require contracts/routers if none are expected
  & (keyof HandlersForContracts<Router> extends '' ? {} : { contracts: HandlersForContracts<Router> })
  & (keyof HandlersForRouters<Router> extends '' ? {} : { routers: HandlersForRouters<Router> })
);

export type HandlersForRouters<Router extends AnyRouterData> = {
  [Key in keyof Router['routers']]: HandledRouter<Router['routers'][Key]>;
};

type RouterEntry<Router extends AnyRouterData> = [keyof Router['routers'], Router['routers'][keyof Router['routers']]];
