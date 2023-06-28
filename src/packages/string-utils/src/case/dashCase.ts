import { dash } from 'radash';

import { removePrefix } from '../morphology';

const reUpperCase = /(?<![\W_])([A-Z])/g;

export const dashCase = (text: string): string => {
  const textDashCase = dash(text.replaceAll(reUpperCase, ' $1'));

  // the above `replaceAll` will add a whitespace if the text starts with an capital letter
  // that whitespace is then replaced by a '-' by the function `dash`
  // if the original text started with a dash then that dash is expected so wee keep it
  // otherwise we remove it
  if (text.startsWith('-')) {
    return textDashCase;
  }

  return removePrefix(textDashCase, '-');
}
