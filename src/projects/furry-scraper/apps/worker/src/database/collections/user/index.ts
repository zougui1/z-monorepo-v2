import { UserQuery } from './UserQuery';
import { User as UserModel } from './User';

export namespace User {
  export const Query = new UserQuery();
  export type Document = UserModel.Document;
  export type Object = UserModel.Object;
}
