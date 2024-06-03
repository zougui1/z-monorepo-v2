import { Show as ShowModel } from './Show';
import { ShowQuery } from './ShowQuery';

export namespace Show {
  export const Prod = new ShowQuery(ShowModel.Prod);
  export const Dev = new ShowQuery(ShowModel.Dev);
  export const Model = ShowModel;

  export type Model = ShowModel;
  export type Query = ShowQuery;
  export type Object = ShowModel.Object;
}
