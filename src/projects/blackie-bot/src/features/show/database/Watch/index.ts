import { Watch as WatchModel } from './Watch';
import { WatchQuery } from './WatchQuery';

export namespace Watch {
  export const Prod = new WatchQuery(WatchModel.Prod);
  export const Dev = new WatchQuery(WatchModel.Dev);

  export type Query = WatchQuery;
  export type Object = WatchModel.Object;
}
