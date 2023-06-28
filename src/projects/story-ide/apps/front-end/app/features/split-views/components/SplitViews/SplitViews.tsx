import { useAppSelector } from '~/store';

import { Grid } from '../Grid';
import type { ViewRenderer } from '../../types';

export const SplitViews = ({ renderView }: SplitViewsProps) => {
  const grid = useAppSelector(state => state.splitViews.grid);

  if (!grid) {
    return null;
  }

  return <Grid grid={grid} renderView={renderView} />;
}

export interface SplitViewsProps {
  renderView: ViewRenderer;
}
