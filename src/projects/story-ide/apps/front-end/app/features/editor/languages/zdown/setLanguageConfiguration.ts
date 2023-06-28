import { name } from './constants';
import type { Monaco } from '../../types';

export const setLanguageConfiguration = (monaco: Monaco): void => {
  monaco.languages.setLanguageConfiguration(name, {
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: '\'', close: '\'' },
      { open: '*', close: '*' },
      { open: '<', close: '>', notIn: ['string'] }
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
    ],
  });
}
