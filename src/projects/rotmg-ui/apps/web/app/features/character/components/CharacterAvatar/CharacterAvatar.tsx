import { useRef } from 'react';

import { classes, type ClassName } from '~/data/classes';
import { Stars } from '~/components/Stars';

import './CharacterAvatar.css';
import { Seasonal } from '../Seasonal';

export const CharacterAvatar = (props: CharacterAvatarProps) => {
  const {
    class: className,
    isSeasonal,
    disabled,
    title,
    stars,
    onSeasonal,
  } = props;
  const seasonalInputRef = useRef<HTMLInputElement | null>(null);

  const { SkinIcon } = classes[className];

  const handleSeasonalChange = (event: React.MouseEvent) => {
    onSeasonal?.(event);

    if (!event.defaultPrevented && seasonalInputRef.current) {
      seasonalInputRef.current.value = String(seasonalInputRef.current.value !== 'true');

      if (!event.defaultPrevented) {
        seasonalInputRef.current?.form?.requestSubmit();
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center CharacterAvatar-root">
      <div className="pb-3">
        <Seasonal
          isSeasonal={isSeasonal}
          disabled={disabled}
          onClick={handleSeasonalChange}
        />
        <input
          ref={seasonalInputRef}
          hidden
          name="isSeasonal"
          value={String(isSeasonal)}
          onChange={() => { }}
        />
      </div>

      <div className="w-12">
        <SkinIcon />
      </div>

      <div className="flex flex-col justify-center px-2 CharacterAvatar-details">
        <span className="text-xl text-center font-bold capitalize text-shadow">
          {className}
        </span>

        {title && (
          <span className="text-sm text-wrap text-center font-bold capitalize text-shadow">
            {title}
          </span>
        )}

        {stars && (
          <div className="flex justify-center">
            <Stars value={stars} max={5} disabled={disabled} />
          </div>
        )}
      </div>
    </div>
  );
}

export interface CharacterAvatarProps {
  class: ClassName;
  isSeasonal: boolean;
  title?: string;
  stars?: number;
  onSeasonal?: (event: React.MouseEvent) => void;
  disabled?: boolean;
}
