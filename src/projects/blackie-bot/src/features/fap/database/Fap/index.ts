import { Fap as FapModel } from './Fap';
import { FapQuery } from './FapQuery';

export namespace Fap {
  export const Prod = new FapQuery(FapModel.Prod);
  export const Dev = new FapQuery(FapModel.Dev);

  export type Query = FapQuery;
  export type Object = FapModel.Object;
}
