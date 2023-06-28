import { Router, type AnyRouter } from './Router';
import type { RouterData } from './RouterData';
import type { AnyContract } from '../contract';
import type { ZodHeaders } from '../types';

export function router<
  Path extends string,
  RContracts extends Record<string, AnyContract>,
  RRouters extends Record<string, AnyRouter>,
  Headers extends ZodHeaders
>(
  path: Path,
  router: Omit<RouterData<Path, RContracts, RRouters, Headers>, 'path'>
): Router<Path, RContracts, RRouters, Headers>;
export function router<
  Path extends string,
  RRouters extends Record<string, AnyRouter>,
  Headers extends ZodHeaders
>(
  path: Path,
  router: Omit<RouterData<Path, {}, RRouters, Headers>, 'path' | 'contracts'>
): Router<Path, {}, RRouters, Headers>;
export function router<
  Path extends string,
  RContracts extends Record<string, AnyContract>,
  Headers extends ZodHeaders
>(
  path: Path,
  router: Omit<RouterData<Path, RContracts, {}, Headers>, 'path' | 'routers'>
): Router<Path, RContracts, {}, Headers>;
export function router<
  Path extends string,
  Headers extends ZodHeaders
>(
  path: Path,
  router: Omit<RouterData<Path, {}, {}, Headers>, 'path' | 'contracts' | 'routers'>
): Router<Path, {}, {}, Headers>;
export function router<
  Path extends string,
  RContracts extends Record<string, AnyContract> | undefined,
  RRouters extends Record<string, AnyRouter> | undefined,
  Headers extends ZodHeaders
>(
  path: Path,
  router: Omit<RouterData<Path, RContracts extends undefined ? {} : RContracts, RRouters extends undefined ? {} : RRouters, Headers>, 'path' | 'contracts' | 'routers'> & Partial<{ contracts: RContracts; routers: RRouters; }>
): Router<Path, RContracts extends undefined ? {} : RContracts, RRouters extends undefined ? {} : RRouters, Headers> {
  return new Router({
    ...router,
    path,
    contracts: router.contracts || {},
    routers: router.routers || {},
  }) as Router<Path, RContracts extends undefined ? {} : RContracts, RRouters extends undefined ? {} : RRouters, Headers>;
}
