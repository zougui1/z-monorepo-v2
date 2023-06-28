import { CursorQuery } from './CursorQuery';
import { Cursor as CursorModel, CursorStatus } from './Cursor';

export namespace Cursor {
  export const Query = new CursorQuery();
  export const Status = CursorStatus;
  export type Document = CursorModel.Document;
  export type Object = CursorModel.Object;
}
