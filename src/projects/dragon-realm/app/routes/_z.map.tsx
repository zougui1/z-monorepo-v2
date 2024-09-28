import { Map } from '~/components/canvas/Map_old';
import { VectorArray } from '~/types';



export default function MapIndex() {
  const boundaryPoints: VectorArray[] = [
    [-10, -10, 1],
    [20, -10, 1],
    [20, -15, 1],
    [30, -15, 1],
    [30, -10, 1],
    [40, -10, 1],
    [40, -2, 1],
    [42, -2, 1],
    [42, 0, 1],
    [45, 0, 1],
    [45, 7, 1],
    [41, 7, 1],
    [41, 10, 1],
    [30, 10, 1],
    [30, 13, 1],
    [30, 18, 1],
    [27, 18, 1],
    [27, 20, 1],
    [25, 20, 1],
    [25, 23, 1],
    [20, 23, 1],
    [10, 23, 1],
    [10, 20, 1],
    [8, 20, 1],
    [8, 15, 1],
    [5, 15, 1],
    [5, 12, 1],
    [2, 12, 1],
    [2, 8, 1],
    [-3, 8, 1],
    [-3, 5, 1],
    [-20, 5, 1],
    [-20, 0, 1],
    [-15, 0, 1],
    [-15, -5, 1],
    [-10, -5, 1],
    [-10, -10, 1],
  ];

  const locations = [
    { id: 'a', position: [15, 15, 0], name: 'Waterfall' },
  ];

  const exits = [
    { id: 'a', position: [-19.5, 2.5, 0], direction: 'vertical', size: 5 },
  ];

  return (
    <div className="w-screen" style={{ height: 'calc(100vh - 5rem)' }}>
      <Map
        boundaryPoints={boundaryPoints}
        locations={locations}
        exits={exits}
      />
    </div>
  );
}
