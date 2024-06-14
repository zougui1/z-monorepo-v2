import type { AnyContract } from '../contract';
import type { ZodHeaders } from '../types';

export interface RouterData<RHeaders extends ZodHeaders> {
  headers?: RHeaders | undefined;
}

export type AnyPartialRouter = RouterData<ZodHeaders> & { path?: string; contracts?: Record<string, AnyContract>; routers?: Record<string, AnyPartialRouter>; };
export type AnyRouterData = RouterData<ZodHeaders> & { path: string; contracts: Record<string, AnyContract>; routers: Record<string, AnyRouterData>; };
