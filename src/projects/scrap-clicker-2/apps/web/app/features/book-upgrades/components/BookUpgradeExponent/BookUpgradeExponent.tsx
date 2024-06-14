import { formatExponent } from './utils';
import { BookUpgrade } from '../BookUpgrade';

export const BookUpgradeExponent = ({ level, upgradePerLevel, invalidLevel, ...rest }: BookUpgradeExponentProps) => {
  const total = invalidLevel ? 0 : Math.pow(upgradePerLevel, level);

  return (
    <BookUpgrade
      {...rest}
      level={level}
      upgradePerLevel={formatExponent(upgradePerLevel)}
      upgradeTotal={formatExponent(total)}
    />
  );
}

export interface BookUpgradeExponentProps {
  level: number;
  icon: React.ReactNode;
  upgradePerLevel: number;
  highlight?: boolean;
  inputName?: string;
  error?: string;
  invalidLevel?: string;
  onUpgrade?: React.MouseEventHandler;
}
