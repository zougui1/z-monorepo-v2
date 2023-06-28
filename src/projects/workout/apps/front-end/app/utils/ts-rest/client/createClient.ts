import { convertRouter } from './convertRouter';
import type { InferContracts } from './InferContract'
import type { AnyRouter } from '../router'

export const createClient = <Router extends AnyRouter>(router: Router): Client<Router> => {
  return convertRouter(router);
}

export type Client<Router extends AnyRouter> = InferContracts<Router> & { [Key in keyof Router['routers']]: Client<Router['routers'][Key]>; }
