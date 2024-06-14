import type { SetRequired } from 'type-fest';

export const createImgIcon = ({ src, alt, ...defaultProps }: ImgProps) => {
  const ImgIcon = (props: ImgIconProps) => {
    return <img {...defaultProps} alt={alt} {...props} src={src} />;
  }

  return ImgIcon;
}

export type ImgProps = SetRequired<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'src' | 'alt'
>;

export interface ImgIconProps extends Omit<Partial<ImgProps>, 'src'> {

}
