import { mapObject } from '@zougui/common.object-utils';
import { joinUrl } from '@zougui/common.url-utils';

import { contractToRequest } from './contractToRequest';
import { Router, type AnyRouter } from '../router';

// TODO type
export const convertRouter = <T extends AnyRouter>(router: T): any => {
  return {
    ...mapObject(router.routers, subRouter => {
      return convertRouter(new Router({
        ...subRouter,
        path: joinUrl(router.path, subRouter.path),
      }));
    }),
    ...mapObject(router.contracts, contract => {
      return contractToRequest({
        ...contract,
        path: joinUrl(router.path, contract.path),
      });
    }),
  };
}
