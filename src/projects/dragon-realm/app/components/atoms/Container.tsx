import clsx from 'clsx';

export const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div {...rest} className={clsx('max-w-7xl m-auto pt-20 flex flex-col items-center', className)}>
      {children}
    </div>
  );
}

export interface ContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}
