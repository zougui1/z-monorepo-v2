export class TreeNode<TBranch, TLeaf> {
  readonly parent: TreeNode<TBranch, TLeaf> | undefined;
  readonly data: TBranch | TLeaf;
  protected readonly options: TreeNodeOptions<TBranch, TLeaf>;

  constructor(data: TBranch | TLeaf, options: TreeNodeOptions<TBranch, TLeaf>, parent?: TreeNode<TBranch, TLeaf> | undefined) {
    this.data = data;
    this.options = options;
    this.parent = parent;
  }

  getIsLeaf = (): this is (TreeNode<TBranch, TLeaf> & { data: TLeaf }) => {
    return this.options.getIsLeaf(this.data);
  }

  getIsBranch = (): this is (TreeNode<TBranch, TLeaf> & { data: TBranch }) => {
    return !this.getIsLeaf();
  }

  getChildren = (): (TBranch | TLeaf)[] | undefined => {
    if (!this.getIsBranch()) {
      return;
    }

    return this.options.getChildren(this.data);
  }

  getHasChildren = (): boolean => {
    const children = this.getChildren();
    return !!children && children.length > 0;
  }

  find = (predicate: (data: TBranch | TLeaf) => unknown): TreeNode<TBranch, TLeaf> | undefined => {
    if (predicate(this.data)) {
      return this;
    }

    const children = this.getChildren();

    for (const child of children || []) {
      const childNode = new TreeNode(child, this.options, this);
      const foundNode = childNode.find(predicate);

      if (foundNode) {
        return foundNode;
      }
    }
  }
}

export interface TreeNodeOptions<TBranch, TLeaf> {
  getIsLeaf: (node: TBranch | TLeaf) => boolean;
  getChildren: (node: TBranch) => (TBranch | TLeaf)[];
}
