import type { editor as Editor } from 'monaco-editor';

import { makeInlineCss, createOrEditStyleTag, compact } from '~/utils';

import type { Monaco } from '../../../types';

/**
 * creates editor decorations for color hex codes
 * @returns a dispose function to remove the created style tag and the decorations
 */
export const createDecorations = (options: CreateDecorationsOptions): (() => void) | undefined => {
  const { editor, model, monaco, paneId } = options;

  const reStringColorHexCodes = '(?<=^|\\s)#([a-fA-F0-9]{8}|[a-fA-F0-9]{6}|[a-fA-F0-9]{3,4})(?=\\s|$)';
  const reColorHexCodes = new RegExp(reStringColorHexCodes, 'i');
  const hexCodeMatches = model.findMatches(reStringColorHexCodes, false, true, false, '', false);

  const decorations = compact(hexCodeMatches.map((hexCodeMatch, index) => {
    const lineNumber = hexCodeMatch.range.startLineNumber;
    const lineContent = model.getLineContent(lineNumber);
    const [hexCode] = lineContent.match(reColorHexCodes) || [];

    if (!hexCode) {
      return;
    }

    const startColumn = lineContent.indexOf(hexCode) + 1;
    const className = `${paneId}-${index}`;

    return {
      color: hexCode,
      className,
      editor: {
        range: new monaco.Range(lineNumber, startColumn, lineNumber, startColumn + hexCode.length),
        options: { inlineClassName: className },
      },
    };
  }));

  const css = decorations.map(decoration => {
    return makeInlineCss(`.${decoration.className}`, {
      border: `3px solid ${decoration.color}`,
      boxShadow: [
        '0 0 1px #fffa',
        '0 0 1px #fffa inset',
      ].join(','),
    });
  }).join('');

  const removeStyle = createOrEditStyleTag(paneId, css);
  const decorationCollection = editor.createDecorationsCollection(decorations.map(decoration => decoration.editor));

  return () => {
    removeStyle?.();
    decorationCollection.clear();
  }
}

export interface CreateDecorationsOptions {
  paneId: string;
  monaco: Monaco;
  model: Editor.ITextModel;
  editor: Editor.IStandaloneCodeEditor;
}
