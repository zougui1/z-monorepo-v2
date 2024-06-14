import { useState } from 'react';
import { Outlet, useLocation } from '@remix-run/react';
import { Tabs, Container } from '@mui/material';

import { getClasses } from '~/api/classes';
import { LinkTab } from '~/components/LinkTab';

const links = {
  sumary: '/',
  exaltations: '/exaltations',
  characters: '/characters',
  characterMaxing: '/character-maxing',
  hoard: '/hoard',
};

export const loader = async () => {
  return await getClasses();
}

export default function Layout() {
  const location = useLocation();
  const defaultValue = Object.values(links).includes(location.pathname)
    ? location.pathname
    : '';
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }

  return (
    <div className="w-full">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="navigation tabs"
        role="navigation"
        className="w-full"
      >
        <LinkTab
          label=""
          href=""
          value=""
          className="!hidden"
        />

        <LinkTab
          label="Summary"
          href={links.sumary}
          value={links.sumary}
        />

        <LinkTab
          label="Exaltations"
          href={links.exaltations}
          value={links.exaltations}
        />

        <LinkTab
          label="Characters"
          href={links.characters}
          value={links.characters}
        />

        <LinkTab
          label="Character Maxing"
          href={links.characterMaxing}
          value={links.characterMaxing}
        />

        <LinkTab
          label="Hoard"
          href={links.hoard}
          value={links.hoard}
        />
      </Tabs>

      <Container className="py-6">
        <Outlet />
      </Container>
    </div>
  );
}
