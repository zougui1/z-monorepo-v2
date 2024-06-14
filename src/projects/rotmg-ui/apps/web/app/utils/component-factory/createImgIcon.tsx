import { forwardRef } from 'react';
import clsx from 'clsx';
import type { SetRequired } from 'type-fest';

export const createImgIcon = ({ src, alt, className, ...defaultProps }: ImgProps) => {
  const Icon = forwardRef<HTMLImageElement, ImgIconProps>(function ImgIcon(props, ref) {
    return <img
      {...defaultProps}
      alt={alt}
      {...props}
      src={src}
      ref={ref}
      className={clsx(className, props.className)}
    />;
  }) as IconComponent;

  Icon.src = src;

  return Icon;
}

export type ImgProps = SetRequired<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'src' | 'alt'
>;

export interface ImgIconProps extends Omit<Partial<ImgProps>, 'src'> {

}

export type IconComponent = (
  & React.ForwardRefExoticComponent<Omit<ImgIconProps, 'ref'>
  & React.RefAttributes<HTMLImageElement>>
  & { src: string; }
);
