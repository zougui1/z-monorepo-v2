export enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Head = 'HEAD',
  Options = 'OPTIONS',
}

export type MethodWithoutBody = Method.Get | Method.Head | Method.Options | Method.Delete;
export type MethodWithBody = Method.Post | Method.Put | Method.Patch;
