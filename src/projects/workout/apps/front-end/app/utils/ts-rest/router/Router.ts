import type zod from 'zod';

import type { ZodPathShape } from '@zougui/common.url-utils';

import type { RouterData } from './RouterData';
import type { AnyContract, ContractData } from '../contract';
import type { Method } from '../Method';
import type { ZodHeaders } from '../types';

export class Router<
  RPath extends string,
  RContracts extends Record<string, AnyContract>,
  RRouters extends Record<string, AnyRouter>,
  RHeaders extends ZodHeaders,
> {
  readonly path: RPath;
  readonly contracts: RContracts;
  readonly routers: RRouters;
  readonly headers: RHeaders | undefined;

  constructor(data: RouterData<RPath, RContracts, RRouters, RHeaders>) {
    this.path = data.path;
    this.contracts = data.contracts;
    this.routers = data.routers;
    this.headers = data.headers;
  }

  addRouter<
    SubPath extends string,
    SubContracts extends Record<string, AnyContract>,
    SubRouters extends Record<string, AnyRouter>,
    SubHeaders extends ZodHeaders,
  >(
    subRouter: Router<SubPath, SubContracts, SubRouters, SubHeaders>,
  ): Router<RPath, RContracts, RRouters & { [key in SubPath]: Router<SubPath, SubContracts, SubRouters, SubHeaders> }, RHeaders> {
    const router = new Router<RPath, RContracts, RRouters & { [key in SubPath]: Router<SubPath, SubContracts, SubRouters, SubHeaders> }, RHeaders>({
      path: this.path,
      headers: this.headers,
      contracts: this.contracts,
      routers: {
        ...this.routers,
        [subRouter.path]: subRouter,
      },
    });

    return router;
  }

  addContract<
    CName extends string,
    CMethod extends Method,
    CPath extends string,
    CParams extends ZodPathShape<CPath>,
    CQuery extends zod.AnyZodObject,
    CBody extends zod.AnyZodObject,
    CResponse extends zod.ZodType,
    CHeaders extends ZodHeaders,
  >(
      name: CName,
      data: ContractData<CMethod, CPath, CParams, CQuery, CBody, CResponse, CHeaders>,
  ): Router<RPath, RContracts & { [key in CName]: ContractData<CMethod, CPath, CParams, CQuery, CBody, CResponse, CHeaders> }, RRouters, RHeaders> {
    const router = new Router<RPath, RContracts & { [key in CName]: ContractData<CMethod, CPath, CParams, CQuery, CBody, CResponse, CHeaders> }, RRouters, RHeaders>({
      path: this.path,
      headers: this.headers,
      routers: this.routers,
      contracts: {
        ...this.contracts,
        [name]: data,
        // the type fails for some reason
      } as RContracts & { [key in CName]: ContractData<CMethod, CPath, CParams, CQuery, CBody, CResponse, CHeaders> },
    });

    return router;
  }
}

export type AnyRouter = Router<string, Record<string, AnyContract>, Record<string, AnyRouter>, ZodHeaders>;
