import type { AnyRouterData } from '@zougui/common.ts-rest.core';

import type { HandledUnknownContract } from '../contract';

export type HandledContracts<Router extends AnyRouterData> = {
  [Key in keyof Router['contracts']]: HandledUnknownContract<Router['contracts'][Key]>;
};

export type HandledRouter<Router extends AnyRouterData = AnyRouterData> = Omit<Router, 'routers' | 'contracts'> & { contracts: HandledContracts<Router>; routers: HandledRouters<Router> };

export type HandledRouters<Router extends AnyRouterData> = {
  [Key in keyof Router['routers']]: HandledRouter<Router['routers'][Key]>;
};
