import { useMap } from '../context';
import { MovableDot as BaseMovableDot, MovableDotProps as BaseMovableDotProps } from '../../MovableDot';

export const MapMovableDot = (props: MapMovableDotProps) => {
  const state = useMap();

  return (
    <BaseMovableDot
      {...props}
      boundaryPoints={state.boundaryPoints}
      onMove={state.onMove}
    />
  );
}

export interface MapMovableDotProps extends Omit<BaseMovableDotProps, 'boundaryPoints' | 'onMove'> {

}
