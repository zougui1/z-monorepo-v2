import { Fap as FapModel } from './Fap';
import { FapQuery } from './FapQuery';

export namespace Fap {
  export const Prod = new FapQuery(FapModel.Prod);
  export const Test = new FapQuery(FapModel.Test);

  export type Query = FapQuery;
  export type Object = FapModel.Object;
}
