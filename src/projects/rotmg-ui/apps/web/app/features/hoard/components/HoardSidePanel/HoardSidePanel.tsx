import { Hoard } from './compounds/Hoard';
import { Filters } from './compounds/Filters';

export const HoardSidePanel = ({ children }: HoardSidePanelProps) => {
  return (
    <div
      className="bg-gray-700 px-4 flex flex-col gap-2 rounded-md *:py-2 divide-y divide-gray-600"
      style={{ minWidth: 350, maxWidth: 400 }}
    >
      {children}
    </div>
  );
}

export interface HoardSidePanelProps {
  children?: React.ReactNode;
}

HoardSidePanel.Hoard = Hoard;
HoardSidePanel.Filters = Filters;
