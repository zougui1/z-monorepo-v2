export enum Method {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
  Delete = 'delete',
  Head = 'head',
  Options = 'options',
}

export const methodsWithBody = [
  Method.Post,
  Method.Patch,
  Method.Put,
];

export type MethodWithoutBody = Method.Get | Method.Head | Method.Options | Method.Delete;
export type MethodWithBody = Method.Post | Method.Put | Method.Patch;
