import { IconButton } from '@mui/material';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';

import './NumberInputArrows.css';

export const NumberInputArrows = ({ onUp, onDown, disabledUp, disabledDown }: NumberInputArrowsProps) => {
  return (
    <div className="flex flex-col">
      <IconButton
        onClick={onUp}
        disabled={disabledUp}
        className="!p-0 NumberInputArrows-button"
      >
        <KeyboardArrowUpIcon className="!text-sm" />
      </IconButton>

      <IconButton
        onClick={onDown}
        disabled={disabledDown}
        className="!p-0 NumberInputArrows-button"
      >
        <KeyboardArrowDownIcon className="!text-sm" />
      </IconButton>
    </div>
  );
}

export interface NumberInputArrowsProps {
  onUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabledUp?: boolean;
  disabledDown?: boolean;
}
