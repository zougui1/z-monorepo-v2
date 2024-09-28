import { forwardRef } from 'react';
import { VariantProps, tv } from 'tailwind-variants';

const defaultVariant = 'span';

const typography = tv({
  variants: {
    variant: {
      span: 'text-xl',
      p: '',
      h1: 'text-6xl font-medium',
      h2: 'text-4xl font-medium',
      h3: '',
      h4: '',
      h5: '',
      h6: '',
      caption: 'text-sm',
    },
  },

  defaultVariants: {
    variant: defaultVariant,
  },
});

export const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(({ children, component, variant, className, ...rest }, ref) => {
  const Component = component || variant || defaultVariant;

  return (
    <Component {...rest} ref={ref} className={typography({ variant, className })}>
      {children}
    </Component>
  )
});

Typography.displayName = 'Typography';

type Variant = VariantProps<typeof typography>['variant'];

export interface TypographyProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: Variant;
  component?: Variant | 'div';
}
