import { useState } from 'react';
import { Outlet, useLocation } from '@remix-run/react';
import { Tabs, Container } from '@mui/material';

import stats from '~/assets/images/Stats.webp';
import { getData } from '~/api/data';
import { LinkTab } from '~/components/LinkTab';
import { StarIcon, XPIcon } from '~/components/icons';

export const loader = async () => {
  return await getData();
}

export default function Layout() {
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

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
          icon={<img src={stats} alt="Stats" className="w-8" />}
          label="Summary"
          href="/"
          value="/"
          className="!max-w-28 md:!max-w-none !px-2 md:!px-4"
        />

        <LinkTab
          icon={<StarIcon className="w-8" />}
          label="Star calculator"
          href="/star-calculator"
          value="/star-calculator"
          className="!max-w-28 md:!max-w-none !px-2 md:!px-4"
        />

        <LinkTab
          icon={<XPIcon className="w-8" />}
          label="Book Upgrades"
          href="/book-upgrades"
          value="/book-upgrades"
          className="!max-w-28 md:!max-w-none !px-2 md:!px-4"
        />
      </Tabs>

      <Container className="py-6">
        <Outlet />
      </Container>
    </div>
  );
}
