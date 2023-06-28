import { dashCase } from '@zougui/common.string-utils';

export const makeInlineCss = (selector: string, cssObject: React.CSSProperties): string => {
  const cssRules = Object.entries(cssObject).reduce((cssString, [key, value]) => {
    const propertyName = dashCase(key);
    const cssValue = typeof value === 'number'
      ? `${value}px`
      : value;

    return `${cssString}${propertyName}:${cssValue};`;
  }, '');

  return `${selector}{${cssRules}}`;
}
