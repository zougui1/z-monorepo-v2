import { useAppDispatch } from 'app/store';

import { Grid } from '../Grid';
import { focusView } from '../../slice';
import type { SplitNode, ViewRenderer } from '../../types';

export const View = ({ view, renderView }: ViewProps) => {
  const dispatch = useAppDispatch();

  const handleViewClick = (): void => {
    dispatch(focusView({ id: view.id }));
  }

  if (!('views' in view)) {
    return (
      <section className="w-full h-full" onClick={handleViewClick}>
        {renderView(view)}
      </section>
    );
  }

  return <Grid renderView={renderView} grid={view} />;
}

export interface ViewProps {
  view: SplitNode;
  renderView: ViewRenderer;
}
