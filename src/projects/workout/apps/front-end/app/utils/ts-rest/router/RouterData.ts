import type { AnyRouter } from './Router';
import type { AnyContract } from '../contract';
import type { ZodHeaders } from '../types';

export interface RouterData<
  RPath extends string,
  RContracts extends Record<string, AnyContract>,
  RRouters extends Record<string, AnyRouter>,
  RHeaders extends ZodHeaders,
> {
  path: RPath;
  contracts: RContracts;
  routers: RRouters;
  headers?: RHeaders | undefined;
}
