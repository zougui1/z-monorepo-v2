import { name } from './constants';
import { theme } from '../../theme';
import type { Monaco } from '../../types';

export const defineTheme = (monaco: Monaco): void => {
  monaco.editor.defineTheme(name, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {
        token: 'keyword',
        foreground: theme['editor.token.keyword'],
      },
      {
        token: 'dialogue',
        foreground: theme['editor.token.dialogue'],
      },
      {
        token: 'thought',
        foreground: theme['editor.token.thought'],
      },
      {
        token: 'label',
        foreground: theme['editor.token.label'],
      },
      {
        token: 'link',
        foreground: theme['editor.token.link'],
      },
      {
        token: 'heading',
        foreground: theme['editor.token.heading'],
      },
      {
        token: 'list',
        foreground: theme['editor.token.list'],
      },
      {
        token: 'italic',
        fontStyle: 'italic',
        foreground: theme['editor.token.italic'],
      },
      {
        token: 'italic-keyword',
        fontStyle: 'italic',
        foreground: theme['editor.token.keyword'],
      },
      {
        token: 'italic-dialogue',
        fontStyle: 'italic',
        foreground: theme['editor.token.dialogue'],
      },
      {
        token: 'italic-thought',
        fontStyle: 'italic',
        foreground: theme['editor.token.thought'],
      },
      {
        token: 'bold',
        fontStyle: 'bold',
        foreground: theme['editor.token.bold'],
      },
      {
        token: 'bold-italic',
        fontStyle: 'bold italic',
        foreground: theme['editor.token.italic'],
      },
    ],
    colors: theme,
  });
}
