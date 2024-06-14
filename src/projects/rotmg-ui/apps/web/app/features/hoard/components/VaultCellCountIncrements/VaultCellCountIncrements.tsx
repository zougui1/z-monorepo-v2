import { IconButton } from '@mui/material';
import {
  Remove as RemoveIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export const VaultCellCountIncrements = ({ count, onCount }: VaultCellCountIncrementsProps) => {
  const handleCount = (getCount: () => number) => (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onCount(getCount());
  }

  return (
    <div className="absolute top-1/2 flex justify-between w-full" style={{ transform: 'translateY(-50%)' }}>
      <IconButton disabled={count <= 0} onClick={handleCount(() => count - 1)}>
        <RemoveIcon className="icon-shadow" />
      </IconButton>
      <IconButton onClick={handleCount(() => count + 1)}>
        <AddIcon className="icon-shadow" />
      </IconButton>
    </div>
  );
}

export interface VaultCellCountIncrementsProps {
  count: number;
  onCount: (count: number) => void;
}
