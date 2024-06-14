import { NumberInput } from '~/components/NumberInput';

export const BookUpgradeInput = ({ error, ...rest }: BookUpgradeInputProps) => {
  return (
    <NumberInput
      {...rest}
      tooltipError={error}
      className="w-14"
      variant="standard"
      invalidNumberErrorAsTooltip
    />
  );
}

export interface BookUpgradeInputProps {
  defaultValue: unknown;
  name?: string;
  error?: string;
  onUpArrow?: React.MouseEventHandler;
  disabledUpArrow?: boolean;
}
