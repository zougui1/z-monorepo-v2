import { sum } from '@zougui/common.math-utils';

import type { SplitGrid, SplitNode, SplitNode, LooseRefSplitNode } from '../types';

const minSize = 200;


// TODO use this code to compute the min-width/min-height of the split views
export const flattenSplitGrids = (grid: SplitGrid, width: number, height: number, top: number, left: number): Record<string, LooseRefSplitNode> => {
  const nodes = flattenSplitGrid(grid, width, height, top, left);

  for (const node of Object.values(nodes)) {
    addMaxSizes(node);
  }

  nodes[grid.id].maxWidth = width;
  nodes[grid.id].maxHeight = height;

  return Object.entries(nodes).reduce((acc, [key, node]) => {
    acc[key] = loosenRefs(node);
    return acc;
  }, {} as Record<string, LooseRefSplitNode>);
}

const loosenRefs = (node: SplitNode): LooseRefSplitNode => {
  if (!('views' in node)) {
    return node;
  }

  return {
    ...node,
    views: node.views.map(view => view.id),
  };
}

const flattenSubViews = (
  nodes: SplitNode[],
  direction: 'horizontal' | 'vertical',
  width: number,
  height: number,
  parentTop: number,
  parentLeft: number,
  parentId?: string | undefined
): { sub: Record<string, SplitNode>; flat: Record<string, SplitNode> } => {
  let flatNodes: Record<string, SplitNode> = {};

  const subNodes = nodes.reduce((acc, view, index) => {
    const viewWidth = direction === 'horizontal'
      ? Math.floor(width / nodes.length)
      : width;
    const viewHeight = direction === 'vertical'
      ? Math.floor(height / nodes.length)
      : height;

    const viewTop = direction === 'horizontal'
      ? parentTop
      : Math.floor(parentTop + (viewHeight * (index + 0)));
    const viewLeft = direction === 'vertical'
      ? parentLeft
      : Math.floor(parentLeft + (viewWidth * (index + 0)));

    const node = {
      ...view,
      parentId,
      width: viewWidth,
      height: viewHeight,
      top: viewTop - parentTop,
      left: viewLeft - parentLeft,
      minWidth: minSize,
      minHeight: minSize,
      maxWidth: width,
      maxHeight: height,

    };

    if ('direction' in node) {
      const subNodes = flattenSubViews(node.views, node.direction, viewWidth, viewHeight, viewTop, viewLeft, node.id);
      const subNodeList = Object.values(subNodes.sub);
      const subMinWidths = subNodeList.map(n => n.minWidth);
      const subMinHeights = subNodeList.map(n => n.minHeight);

      const minWidth = node.direction === 'horizontal'
        ? sum(subMinWidths)
        : Math.max(...subMinWidths);
      const minHeight = node.direction === 'vertical'
        ? sum(subMinHeights)
        : Math.max(...subMinHeights);

      flatNodes = {
        ...flatNodes,
        ...subNodes.flat,
      };

      acc = {
        ...acc,
        [node.id]: {
          ...node,
          minWidth,
          minHeight,
          views: Object.values(subNodes.sub),
        },
      };
    } else {
      acc[node.id] = node;
    }

    return acc;
  }, {} as Record<string, SplitNode>);

  return {
    sub: subNodes,
    flat: {
      ...subNodes,
      ...flatNodes,
    },
  };
}

const flattenSplitGrid = (
  grid: SplitGrid,
  width: number,
  height: number,
  top: number,
  left: number,
  parentId?: string | undefined,
): Record<string, SplitNode> => {
  const viewWidth = grid.direction === 'horizontal'
    ? Math.floor(width / grid.views.length)
    : width;
  const viewHeight = grid.direction === 'vertical'
    ? Math.floor(height / grid.views.length)
    : height;

  const subNodes = flattenSubViews(grid.views, grid.direction, width, height, top, left, grid.id);
  const subNodeList = Object.values(subNodes.sub);
  const subMinWidths = subNodeList.map(n => n.minWidth);
  const subMinHeights = subNodeList.map(n => n.minHeight);

  const minWidth = grid.direction === 'horizontal'
    ? sum(subMinWidths)
    : Math.max(...subMinWidths);
  const minHeight = grid.direction === 'vertical'
    ? sum(subMinHeights)
    : Math.max(...subMinHeights);

  const nodes: Record<string, SplitNode> = {
    [grid.id]: {
      ...grid,
      parentId,
      width,
      height,
      top,
      left,
      minWidth,
      minHeight,
      maxWidth: width,
      maxHeight: height,
      views: Object.values(subNodes.sub),
    },
    ...subNodes.flat,
  };

  return nodes;
}

const addMaxSizes = (grid: SplitNode): void => {
  if (!('views' in grid)) {
    return;
  }

  for (const view of grid.views) {
    const siblings = grid.views.filter(v => v.id !== view.id);
    const siblingsMinWidths = siblings.map(s => s.minWidth);
    const siblingsMinHeights = siblings.map(s => s.minHeight);

    view.maxWidth = grid.direction === 'horizontal'
      ? grid.width - sum(siblingsMinWidths)
      : grid.width;
    view.maxHeight = grid.direction === 'vertical'
      ? grid.height - sum(siblingsMinHeights)
      : grid.height;
  }
}

/*const flattenSplitGrid = (grid: PublicSplitGrid, width: number, height: number, parentId?: string | undefined): Record<string, SplitNode> => {
  const firstNode: Record<string, SplitNode> = {
    [grid.id]: {
      ...grid,
      parentId,
      width,
      height,
      minWidth: minSize,
      minHeight: minSize,
    }
  };

  const nodes = grid.views.reduce((acc, view) => {
    const viewWidth = grid.direction === 'horizontal'
      ? Math.floor(width / grid.views.length)
      : width;
    const viewHeight = grid.direction === 'vertical'
      ? Math.floor(height / grid.views.length)
      : height;

    const node = {
      ...view,
      parentId: grid.id,
      width: viewWidth,
      height: viewHeight,
      minWidth: minSize,
      minHeight: minSize,
    };

    if ('direction' in node) {
      const subNodes = flattenSplitGrid(node, viewWidth, viewHeight, grid.id);
      const subNodeList = Object.values(subNodes);

      acc = {
        ...acc,
        ...subNodes,
        [node.id]: {
          ...node,
          minWidth: sum(subNodeList.map(n => n.minWidth)) - minSize,
          minHeight: sum(subNodeList.map(n => n.minHeight)) - minSize,
        }
      };
    } else {
      acc[node.id] = node;
    }

    return acc;
  }, firstNode);

  const nodeList = Object.values(nodes);

  nodes[grid.id].minWidth = sum(nodeList.map(n => n.minWidth)) - minSize,
  nodes[grid.id].minHeight = sum(nodeList.map(n => n.minHeight)) - minSize,

  return nodes;
}*/
