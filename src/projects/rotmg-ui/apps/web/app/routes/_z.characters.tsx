import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import type { MetaFunction, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { getCharacters, createCharacter, updateCharacter } from '~/api/characters';
import { getClasses, updateClass } from '~/api/classes';
import { CharacterCard } from '~/features/character/components/CharacterCard';
import { deleteCharacter } from '~/api/characters/deleteCharacter';
import type { ClassName } from '~/data/classes';
import { CharactersSidePanel } from '~/features/character/components/CharactersSidePanel';
import type { FilterTernary } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'Characters' },
    { name: 'description', content: 'Characters' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  const allCharacters = await getCharacters();
  const classes = await getClasses();

  const filters = {
    maxed: (searchParams.get('maxed') ?? 'all') as FilterTernary,
    exalted: (searchParams.get('exalted') ?? 'all') as FilterTernary,
    maxedStars: (searchParams.get('maxedStars') ?? 'all') as FilterTernary,
    seasonal: (searchParams.get('seasonal') ?? 'yes') as FilterTernary,
  };

  let characters = allCharacters;

  if (filters.maxed !== 'all') {
    characters = characters.filter(character => {
      const potionsRemaining = Object.values(character.potionsRemaining);

      switch (filters.maxed) {
        case 'yes':
          return potionsRemaining.every(remaining => remaining <= 0);
        case 'no':
          return potionsRemaining.some(remaining => remaining > 0);
      }
    });
  }
  switch (filters.maxed) {
    case 'yes':
      characters = characters.filter(character => {
        return Object.values(character.potionsRemaining);
      });
      break;
    case 'no':
      break;
  }

  if (filters.maxedStars !== 'all') {
    characters = characters.filter(character => {
      return filters.maxedStars === 'yes'
        ? classes[character.className].stars >= 5
        : classes[character.className].stars < 5;
    });
  }

  if (filters.exalted !== 'all') {
    characters = characters.filter(character => {
      const exaltations = Object.values(classes[character.className].exaltations);

      switch (filters.exalted) {
        case 'yes':
          return exaltations.every(exaltation => exaltation.level >= 5);
        case 'no':
          return exaltations.some(exaltation => exaltation.level < 5);
      }
    });
  }

  if (filters.seasonal !== 'all') {
    characters = characters.filter(character => {
      return filters.seasonal === 'yes'
        ? character.isSeasonal
        : !character.isSeasonal;
    });
  }

  return { characters, classes };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const intent = body.get('intent');
  console.log('intent:', intent)

  if (intent === 'create') {
    const className = body.get('className');
    await createCharacter(className as ClassName);
    return null;
  }

  if (intent === 'delete') {
    const characterId = String(body.get('characterId'));
    await deleteCharacter(characterId);
    return null;
  }

  if (intent === 'update') {
    const characterId = String(body.get('characterId'));
    const isSeasonal = String(body.get('isSeasonal')) === 'true';
    const className = String(body.get('className'));
    // replace empty string with undefined
    const label = body.get('label')?.toString().trim() || undefined;
    const stars = Number(body.get('stars'));
    const life = Number(body.get('potionsRemaining.life'));
    const mana = Number(body.get('potionsRemaining.mana'));
    const attack = Number(body.get('potionsRemaining.attack'));
    const defense = Number(body.get('potionsRemaining.defense'));
    const speed = Number(body.get('potionsRemaining.speed'));
    const dexterity = Number(body.get('potionsRemaining.dexterity'));
    const vitality = Number(body.get('potionsRemaining.vitality'));
    const wisdom = Number(body.get('potionsRemaining.wisdom'));

    await updateClass({
      className,
      stars,
    });

    await updateCharacter(characterId, {
      isSeasonal,
      label,
      potionsRemaining: {
        life,
        mana,
        attack,
        defense,
        speed,
        dexterity,
        vitality,
        wisdom,
      },
    });
  }

  return null;
}

// TODO the current character list must be for a page that concerns unmaxed characters only

export default function Index() {
  const { characters, classes } = useLoaderData<typeof loader>();
  const [deletingCharacterId, setDeletingCharacterId] = useState<string>();

  return (
    <div className="flex justify-between gap-4" style={{ maxHeight: '90vh' }}>
      <ul className="flex flex-col gap-4 pr-2 overflow-auto" style={{ width: '100%', minWidth: 400, maxWidth: 650 }}>
        {characters.map(character => (
          <li key={character.id}>
            <CharacterCard
              character={character}
              stars={classes[character.className].stars}
              disabled={deletingCharacterId === character.id}
            >
              <div className="flex max-md:flex-wrap">
                <div className="flex flex-col">
                  <CharacterCard.ActionMenu>
                    <CharacterCard.ActionMenu.ExaltationsLink />
                    <CharacterCard.ActionMenu.Delete
                      onClick={() => setDeletingCharacterId(character.id)}
                    />
                  </CharacterCard.ActionMenu>
                </div>

                <CharacterCard.Avatar />

                <div className="flex flex-col">
                  <CharacterCard.MaxedStatCount />
                  <CharacterCard.LabelInput />
                </div>
              </div>
          </CharacterCard>
          </li>
        ))}
      </ul>

      <CharactersSidePanel characters={characters}>
        <CharactersSidePanel.CharacterListSection />
        <CharactersSidePanel.FiltersSection>
          <CharactersSidePanel.FiltersSection.Maxed />
          <CharactersSidePanel.FiltersSection.Exalted />
          <CharactersSidePanel.FiltersSection.MaxedStars />
          <CharactersSidePanel.FiltersSection.Seasonal defaultValue="yes" />
        </CharactersSidePanel.FiltersSection>
      </CharactersSidePanel>
    </div>
  );
}
