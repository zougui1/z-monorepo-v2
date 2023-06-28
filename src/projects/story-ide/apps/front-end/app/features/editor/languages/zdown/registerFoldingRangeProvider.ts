import type { editor as Editor, languages } from 'monaco-editor';
import { unique } from 'radash';

import { name } from './constants';
import type { Monaco } from '../../types';

export const registerFoldingRangeProvider = (monaco: Monaco): void => {
  monaco.languages.registerFoldingRangeProvider(name, {
    provideFoldingRanges: model => {
      return findHeadingRanges(model);
    },
  });
}


const findHeadingRanges = (model: Editor.ITextModel): languages.ProviderResult<languages.FoldingRange[]> => {
  const headingMatches = unique(model.findMatches(
    '^#',
    false,
    true,
    false,
    '',
    false,
  ), match => match.range.startLineNumber);

  return headingMatches.map((match, index) => {
    const lineNumber = match.range.startLineNumber;
    const lineContent = model.getLineContent(lineNumber);
    const [headingMarks = '#'] = lineContent.match(/^#+/) || [];
    // matches a heading that is either of a greater level or a level equal to the current heading
    const reNextHigherHeading = new RegExp(`^#{1,${headingMarks.length}}(?!#)`);
    const nextMatch = headingMatches.slice(index + 1).find(m => {
      return model.getLineContent(m.range.startLineNumber).match(reNextHigherHeading);
    });

    const lastLine = model.getLineCount();

    if(!nextMatch || nextMatch.range.startLineNumber < lineNumber) {
      return {
        start: lineNumber,
        end: lastLine,
      };
    }

    const nextHeadingLineNumber = nextMatch.range.startLineNumber;

    // display the heading's previous line if it is empty
    const nextHeadingPreviousLineNumber = model.getLineContent(nextHeadingLineNumber - 1).trim()
      ? nextHeadingLineNumber - 1
      : nextHeadingLineNumber - 2;

    return {
      start: lineNumber,
      end: nextHeadingPreviousLineNumber < lineNumber ? lastLine : nextHeadingPreviousLineNumber,
    };
  }).filter(Boolean);
}
