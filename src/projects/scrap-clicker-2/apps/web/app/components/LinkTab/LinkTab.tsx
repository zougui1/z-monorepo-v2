import { Link } from '@remix-run/react';
import { Tab, TabProps } from '@mui/material';

export const LinkTab = ({ selected, href, ...props }: LinkTabProps) => {
  return (
    <Tab
      component={Link}
      aria-current={selected && 'page'}
      to={href}
      {...props}
    />
  );
}

export interface LinkTabProps extends TabProps {
  href?: string;
  selected?: boolean;
}
