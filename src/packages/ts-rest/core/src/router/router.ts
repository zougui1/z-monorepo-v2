import type { RouterData, AnyPartialRouter } from './RouterData';
import type { AnyContract } from '../contract';
import type { ZodHeaders } from '../types';

export function router<
  Path extends string,
  RContracts extends Record<string, AnyContract>,
  RRouters extends Record<string, AnyPartialRouter>,
  Headers extends ZodHeaders,
  Router extends RouterData<Headers> & { routers: RRouters; contracts: RContracts; },
>(
  path: Path,
  router: Router,
): Router & { path: Path; };
export function router<
  Path extends string,
  RRouters extends Record<string, AnyPartialRouter>,
  Headers extends ZodHeaders,
  Router extends RouterData<Headers> & { contracts?: Record<string, AnyContract>; routers: RRouters; },
>(
  path: Path,
  router: Router,
): Router & { contracts: {}; path: Path; };
export function router<
  Path extends string,
  RContracts extends Record<string, AnyContract>,
  Headers extends ZodHeaders,
  Router extends RouterData<Headers> & { contracts: RContracts; routers?: Record<string, AnyPartialRouter>; },
>(
  path: Path,
  router: Router,
): Router & { routers: {}; path: Path; };
export function router<
  Path extends string,
  Headers extends ZodHeaders,
  Router extends RouterData<Headers> & { contracts?: Record<string, AnyContract>; routers?: Record<string, AnyPartialRouter>; },
>(
  path: Path,
  router: Router,
): Router & { routers: {}; contracts: {}; path: Path; };
export function router<
  Path extends string,
  RContracts extends Record<string, AnyContract> | undefined,
  RRouters extends Record<string, AnyPartialRouter> | undefined,
  Headers extends ZodHeaders,
  Router extends RouterData<Headers> & { contracts?: Record<string, AnyContract>; routers?: Record<string, AnyPartialRouter>; },
>(
  path: Path,
  router: Router & { contracts?: RContracts; routers?: RRouters; },
): Router & { routers: RContracts extends undefined ? {} : RContracts; contracts: RRouters extends undefined ? {} : RRouters; path: Path; } {
  return {
    ...router,
    path,
    contracts: router.contracts || {},
    routers: router.routers || {},
  } as Router & { routers: RContracts extends undefined ? {} : RContracts; contracts: RRouters extends undefined ? {} : RRouters; path: Path; };
}
