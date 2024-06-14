import { useLoaderData, useSearchParams } from '@remix-run/react';
import type { ActionFunctionArgs, MetaArgs, MetaFunction } from '@remix-run/node';

import { ExaltationSummary } from '~/features/exaltation/components/ExaltationSummary';
import { ClassName, classes as classesData } from '~/data/classes';
import { classOrdering } from '~/data/exaltation';
import { Class, getClasses, updateClass } from '~/api/classes';
import { CharacterExaltations } from '~/features/exaltation/components/CharacterExaltations/CharacterExaltations';

export const meta: MetaFunction = ({ location }: MetaArgs) => {
  // remove the search string's prefix "?"
  const searchParams = new URLSearchParams(location.search.slice(1));
  const className = searchParams.get('className');

  const title = className ? `Exaltations - ${className}` : 'Exaltations';

  return [
    { title },
    { name: 'description', content: title },
  ];
};

export const loader = async () => {
  return await getClasses();
}

export async function action({ request }: ActionFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const className = searchParams.get('className');

  if (!className) {
    return null;
  }

  const body = await request.formData();
  const attackExaltationPoints = Number(body.get('exaltation.attack.points'));
  const defenseExaltationPoints = Number(body.get('exaltation.defense.points'));
  const speedExaltationPoints = Number(body.get('exaltation.speed.points'));
  const dexterityExaltationPoints = Number(body.get('exaltation.dexterity.points'));
  const vitalityExaltationPoints = Number(body.get('exaltation.vitality.points'));
  const wisdomExaltationPoints = Number(body.get('exaltation.wisdom.points'));
  const lifeExaltationPoints = Number(body.get('exaltation.life.points'));
  const manaExaltationPoints = Number(body.get('exaltation.mana.points'));

  return await updateClass({
    className,
    exaltations: {
      attack: attackExaltationPoints,
      defense: defenseExaltationPoints,
      speed: speedExaltationPoints,
      dexterity: dexterityExaltationPoints,
      vitality: vitalityExaltationPoints,
      wisdom: wisdomExaltationPoints,
      life: lifeExaltationPoints,
      mana: manaExaltationPoints,
    },
  });
}

export default function Index() {
  const classes = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = (classData: Class) => {
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams.entries()),
      className: classData.name,
    }));
  }

  const className = searchParams.get('className');

  return (
    <div className="flex items-center gap-12 h-full">
      <ul className="flex flex-col">
        {classOrdering.map(className => classesData[className]).map(classData => (
          <li
            key={classData.name}
            className="*:odd:bg-gray-800 hover:*:bg-gray-700 *:transition"
          >
            <ExaltationSummary
              name={classData.name}
              skinIcon={<classData.SkinIcon />}
              classData={classes[classData.name]}
              onClick={() => handleClick(classes[classData.name])}
            />
          </li>
        ))}
      </ul>

      {className && className in classes && (
        <CharacterExaltations class={classes[className as ClassName]} />
      )}
    </div>
  );
}
