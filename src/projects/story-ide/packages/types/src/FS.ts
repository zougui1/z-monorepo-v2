export namespace FS {
  export type NodeType = 'dir' | 'file';

  export interface Node {
    name: string;
    path: string;
    type: NodeType;
  }
}
