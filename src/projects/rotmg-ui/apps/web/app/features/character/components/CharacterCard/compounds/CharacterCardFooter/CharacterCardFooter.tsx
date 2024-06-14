import { Divider } from '@mui/material';

import { useCharacterCardContext } from '../../CharacterCardContext';

export const CharacterCardFooter = ({ isVisible, children }: CharacterCardFooterProps) => {
  const [state] = useCharacterCardContext();

  if (!state.isFooterVisible && !isVisible) {
    return null;
  }

  return (
    <>
      <Divider />
      {children}
    </>
  );
}

export interface CharacterCardFooterProps {
  isVisible?: boolean;
  children?: React.ReactNode;
}
