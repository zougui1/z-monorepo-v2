export interface SplitGrid {
  id: string;
  direction: 'horizontal' | 'vertical';
  views: SplitNode[];
}

export interface SplitView {
  id: string;
}

export type SplitNode = SplitView | SplitGrid;

export type ViewRenderer = (view: SplitView) => React.ReactNode;
