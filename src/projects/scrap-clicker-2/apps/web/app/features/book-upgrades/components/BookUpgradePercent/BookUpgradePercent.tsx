import { formatPercent } from './utils';
import { BookUpgrade } from '../BookUpgrade';

export const BookUpgradePercent = ({ level, upgradePerLevel, invalidLevel, ...rest }: BookUpgradePercentProps) => {
  const total = invalidLevel ? 0 : (upgradePerLevel * level);

  return (
    <BookUpgrade
      {...rest}
      level={level}
      invalidLevel={invalidLevel}
      upgradePerLevel={formatPercent(upgradePerLevel)}
      // replace NaN (if that is the result) with 0
      upgradeTotal={formatPercent(total)}
    />
  );
}

export interface BookUpgradePercentProps {
  level: number;
  icon: React.ReactNode;
  upgradePerLevel: number;
  highlight?: boolean;
  inputName?: string;
  error?: string;
  invalidLevel?: string;
  onUpgrade?: React.MouseEventHandler;
}
