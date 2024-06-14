import { Router as ExpressRouter } from 'express';

import type { HandledRouter } from './HandledRouter';
import { useContract } from '../contract';

export const useRouter = (router: HandledRouter): ExpressRouter => {
  const rootRouter = ExpressRouter();
  const expressRouter = ExpressRouter();

  for (const subRouter of Object.values(router.routers)) {
    expressRouter.use(useRouter(subRouter));
  }

  for (const contract of Object.values(router.contracts)) {
    expressRouter[contract.method](withSlash(contract.path), useContract(contract));
  }

  rootRouter.use(withSlash(router.path), expressRouter);

  return rootRouter;
}

const withSlash = (str: string): string => str.startsWith('/') ? str : `/${str}`;
