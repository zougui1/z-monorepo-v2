export const Divider = ({ style, ...rest }: DividerProps) => {
  return (
    <hr
      {...rest}
      style={{
        borderImageSource: 'linear-gradient(to right, transparent, #7d7d7d, transparent)',
        borderImageSlice: 1,
        borderImageWidth: 1,
        marginBottom: 0,
        ...style,
      }}
    />
  );
}

export interface DividerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement> {

}
