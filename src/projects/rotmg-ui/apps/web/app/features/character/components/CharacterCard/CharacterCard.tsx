import { useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { useDebouncedCallback } from 'use-debounce';

import type { Character } from '~/api/characters';

import { CharacterCardContextProvider } from './CharacterCardContext';

import { CharacterCardInclusionCheckbox } from './compounds/CharacterCardInclusionCheckbox';
import { CharacterCardActionMenu } from './compounds/CharacterCardActionMenu';
import { CharacterCardAvatar } from './compounds/CharacterCardAvatar';
import { CharacterCardPotions } from './compounds/CharacterCardPotions';
import { CharacterCardFooter } from './compounds/CharacterCardFooter';
import { CharacterCardLabelInput } from './compounds/CharacterCardLabelInput';
import { CharacterCardMaxedStatCount } from './compounds/CharacterCardMaxedStatCount';

export const CharacterCard = (props: CharacterCardProps) => {
  const { children, character, stars, disabled = false } = props;

  const fetcher = useFetcher<Character>();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handler = useDebouncedCallback(() => {
    if (formRef.current) {
      fetcher.submit(formRef.current);
    }
  }, 500);

  return (
    <fetcher.Form
      ref={formRef}
      onChange={handler}
      className="flex flex-col gap-3 bg-gray-700 rounded-md py-3 px-2"
      method="post"
    >
      <CharacterCardContextProvider
        character={character}
        stars={stars}
        disabled={disabled}
      >
        {children}
      </CharacterCardContextProvider>

      <input
        hidden
        name="characterId"
        value={character.id}
        onChange={() => {}}
      />

      <input
        hidden
        name="intent"
        value="update"
        onChange={() => {}}
      />

      <input
        hidden
        name="className"
        value={character.className}
        onChange={() => {}}
      />
    </fetcher.Form>
  );
}

export interface CharacterCardProps {
  character: Character;
  stars: number;
  children?: React.ReactNode;
  disabled?: boolean;
}

CharacterCard.InclusionCheckbox = CharacterCardInclusionCheckbox;
CharacterCard.ActionMenu = CharacterCardActionMenu;
CharacterCard.Avatar = CharacterCardAvatar;
CharacterCard.Potions = CharacterCardPotions;
CharacterCard.Footer = CharacterCardFooter;
CharacterCard.LabelInput = CharacterCardLabelInput;
CharacterCard.MaxedStatCount = CharacterCardMaxedStatCount;
