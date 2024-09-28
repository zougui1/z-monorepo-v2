import { cn } from '~/utils';

export const GameDataDialogFieldset = ({ children, className, ...rest }: GameDataDialogFieldsetProps) => {
  return (
    <fieldset {...rest} className={cn('flex flex-col space-y-4 pb-4', className)}>
      {children}
    </fieldset>
  );
};

export interface GameDataDialogFieldsetProps extends React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement> {

}
