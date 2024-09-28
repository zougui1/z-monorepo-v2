import { DateTime } from 'luxon';

import type { SaveData } from '~/types';
import { Typography } from '../atoms/Typography';

export const SaveItem = ({ save }: SaveItemProps) => {
  const [mainCharacter] = save.characters;
  const savedOn = DateTime.fromISO(save.updatedAt);

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex justify-between">
        <div className="w-1/2">
          <Typography>{save.name}</Typography>
        </div>
        <div className="w-1/2">
          <Typography>Lvl {mainCharacter.level}</Typography>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-1/2">
          <Typography>{'{location}'}</Typography>
        </div>
        <div className="w-1/2">
          <Typography>Saved On: {savedOn.toLocaleString(DateTime.DATETIME_SHORT)}</Typography>
        </div>
      </div>
    </div>
  );
}

export interface SaveItemProps {
  save: SaveData;
}
