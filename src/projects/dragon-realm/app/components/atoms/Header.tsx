import clsx from 'clsx';

export const Header = ({ children, className, classes, ...rest }: HeaderProps) => {
  return (
    <header {...rest} className={clsx('w-full fixed top-0 flex justify-center dark:bg-slate-900 shadow-xl', className)}>
      <div className={clsx('flex justify-between items-center w-full max-w-3xl py-3 px-2', classes?.container)}>
        {children}
      </div>
    </header>
  );
}

export interface HeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  classes?: Partial<Record<'container', string>>;
}
