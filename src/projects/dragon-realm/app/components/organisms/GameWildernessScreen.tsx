import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useGame, useGamePosition } from '~/contexts';
import { Map } from '~/components/canvas/Map';
import type { ExitData } from '~/game';
import type { VectorArray } from '~/types';

//const ENEMY_ENCOUNTER_RATE = 0.025;
const ENEMY_ENCOUNTER_RATE = 0;
const SAFE_STEP_COUNT = 20;

export const GameWildernessScreen = () => {
  const safetyStepsRef = useRef(SAFE_STEP_COUNT);
  const game = useGame();
  const exitRef = useRef<ExitData | undefined>();
  const [areaId, setAreaId] = useState(game.currentArea.id);
  const query = useQuery({
    queryKey: ['areas', areaId],
    queryFn: () => fetch(`/areas/${areaId}`).then(res => res.json()),
    enabled: false,
  });
  const [position, setPosition] = useGamePosition();

  const handleMove = ([x, y, z]: VectorArray) => {
    game.x = x;
    game.y = y;
    game.z = z;

    if (safetyStepsRef.current-- <= 0) {
      const enemyEncounter = Math.random() <= ENEMY_ENCOUNTER_RATE;

      if (enemyEncounter) {
        game.startFight();
      }
    }
  }

  useEffect(() => {
    if (query.data && query.data.id !== game.currentArea.id && exitRef.current) {
      game.changeArea(query.data, exitRef.current.characterPosition);
    }
  }, [game, query.data]);

  useEffect(() => {
    if (areaId!== game.currentArea.id) {
      query.refetch();
    }
  }, [game, areaId, query]);

  return (
    <div className="w-full h-full">
      <Map.Root
        boundaryPoints={game.currentArea.boundaryPoints}
        locations={game.currentArea.locations}
        exits={game.currentArea.exits}
        onLocation={location => game.enterLocation(location)}
        onExit={exit => {
          setAreaId(exit.id);
          exitRef.current = exit;
        }}
        onMove={handleMove}
      >
        <Map.MovableDot position={position} setPosition={setPosition} />
        <Map.Boundaries />
        <Map.Locations />
        <Map.Exits />
      </Map.Root>
    </div>
  );
}
