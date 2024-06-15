import { stats } from '~/data/stats';
import { statOrdering } from '~/data/exaltation';
import { ExaltationProgress } from '~/features/exaltation/components/ExaltationProgress';
import type { Class } from '~/api/classes/schema';
import { getMaxExaltationPoints } from '~/features/exaltation/utils';

export const ExaltationList = ({ exaltations }: ExaltationListProps) => {
  return (
    <ul className="flex flex-col gap-2">
      {statOrdering.map(statName => stats[statName]).map(stat => (
        <li key={stat.name}>
          <ExaltationProgress
            potionIcon={<stat.potion.Small />}
            statName={stat.name}
            shortName={stat.short}
            level={exaltations[stat.name].level}
            maxLevel={5}
            points={exaltations[stat.name].points}
            maxPoints={getMaxExaltationPoints(exaltations[stat.name].level)}
            portalIcon={<stat.PortalIcon className="w-12" />}
          />
        </li>
      ))}
    </ul>
  );
}

export interface ExaltationListProps {
  exaltations: Class['exaltations'];
}
