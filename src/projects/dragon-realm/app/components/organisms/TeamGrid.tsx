import { useEffect, useState } from 'react';

import { CharacterCard } from '~/components/molecules/CharacterCard';
import { cn } from '~/utils';
import type { CharacterData } from '~/types/CharacterData';

export const TeamGrid = ({ characters, className, dir, focused }: TeamGridProps) => {
  //const [focused, setFocused] = useState('Zougui-no');

  /*useEffect(() => {
    const interval = setInterval(() => {
      setFocused(current => {
        const currentIndex = characters.findIndex(char => char.name === current);
        return characters[(currentIndex + 1) % characters.length].name;
      });
    }, 1500);

    return () => {
      clearInterval(interval);
    }
  }, []);*/

  return (
    <div className={cn('flex flex-col space-y-4', className)} dir={dir}>
      {characters.map(character => (
        <div key={character._id}>
          <CharacterCard className="w-[320px]" character={character} focused={character.name === focused} />
        </div>
      ))}
    </div>
  );
}

export interface TeamGridProps {
  characters: CharacterData[];
  className?: string;
  dir?: 'rtl';
  focused?: string;
}
