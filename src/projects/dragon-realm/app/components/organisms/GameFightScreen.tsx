import { useGame, useGameFight, useGameMenu, useGameFightState, useGameFightEvent } from '~/contexts';
import { TeamGrid } from './TeamGrid';
import { useEffect, useState } from 'react';

import { Menu } from '~/components/molecules/Menu';
import { Entity } from '~/game/entity';
import { Divider } from '~/components/atoms/Divider';
import type { Character } from '~/database';
import { DialogTextBlock } from '../molecules/DialogTextBlock';

const convertEntityToCharacter = (entity: Entity): Character => {
  return {
    ...entity,
    _id: entity.id,
    maxHp: entity.stats.get('maxHp'),
    hp: entity.stats.get('hp'),
    maxMp: entity.stats.get('maxMp'),
    mp: entity.stats.get('mp'),
    strength: entity.stats.get('strength'),
    sharpness: entity.stats.get('sharpness'),
    resilience: entity.stats.get('resilience'),
    agility: entity.stats.get('agility'),
    deftness: entity.stats.get('deftness'),
    magicalMight: entity.stats.get('magicalMight'),
    magicalMending: entity.stats.get('magicalMending'),
    level: 1,
    experience: 0,
    class: 'Warrior' as any,
  };
}

export const GameFightScreen = () => {
  const [victory, setVictory] = useState(false);
  const game = useGame();
  useGameFightState();
  const fight = useGameFight();
  const menu = useGameMenu();

  useGameFightEvent('finish', () => setVictory(true));

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between">
        <TeamGrid
          characters={fight.playerTeam.entities.map(convertEntityToCharacter)}
          className="w-half"
          focused={fight.currentEntity?.name}
        />
        <TeamGrid
          characters={fight.enemyTeam.entities.map(convertEntityToCharacter)}
          className="w-half"
          dir="rtl"
          focused={fight.currentEntity?.name}
        />
      </div>

      <Divider />

      <div className="flex justify-center">
        {menu && <Menu options={menu.options} />}
        {victory && <DialogTextBlock text="Victory!" onContinue={game.finishFight} />}
      </div>
    </div>
  );
}
