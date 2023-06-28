import { defineTheme } from './defineTheme';
import { registerFoldingRangeProvider } from './registerFoldingRangeProvider';
import { setLanguageConfiguration } from './setLanguageConfiguration';
import { setMonarchTokensProvider } from './setMonarchTokensProvider';
import { name } from './constants';
import type { Monaco } from '../../types';

export const register = (monaco: Monaco): void => {
  monaco.languages.register({ id: name });
  setMonarchTokensProvider(monaco);
  defineTheme(monaco);
  setLanguageConfiguration(monaco);
  registerFoldingRangeProvider(monaco);
}
