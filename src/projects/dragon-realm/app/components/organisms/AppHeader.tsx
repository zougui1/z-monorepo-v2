import { Header } from '~/components/atoms/Header';
import { Typography } from '~/components/atoms/Typography';

export const AppHeader = ({ children }: AppHeaderProps) => {
  return (
    <Header>
      <Typography className="text-xl font-medium">Dragon Realm</Typography>

      {children}
    </Header>
  );
}

export interface AppHeaderProps {
  children?: React.ReactNode;
}
