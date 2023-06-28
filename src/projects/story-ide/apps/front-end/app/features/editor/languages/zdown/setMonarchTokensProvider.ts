import { name } from './constants';
import type { Monaco } from '../../types';

export const setMonarchTokensProvider = (monaco: Monaco): void => {
  monaco.languages.setMonarchTokensProvider(name, {
    defaultToken: '',
    tokenPostfix: '.md',

    // escape codes
    control: /[\\`*_[\]{}()#+\-.!]/,
    noncontrol: /[^\\`*_[\]{}()#+\-.!]/,
    escapes: /\\(?:@control)/,
    punctuation: /[.?,;!-]/,

    tokenizer: {
      root: [
        // headers (with #)
        [
          /^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/,
          ['white', 'heading', 'heading', 'heading']
        ],

        // dialogues (text between double quotes)
        [/"/, 'dialogue', '@dialogue'],
        // thoughts (text between single quotes)
        [/^'/, 'thought', '@thought'],
        [/\s+'/, 'thought', '@thought'],


        [/@?\*\*\*[^\s](.+)[^\s]\*\*\*/, 'bold-italic'],
        [/@?\*\*[^\s](.+)[^\s]\*\*/, 'bold'],
        [/@?\*(?![\s*])/, 'italic', '@flashback'],

        // list (starting with * or number)
        [/^\s*([*\-+:]|\d+\.)\s/, 'list'],

        // punctuation
        [/@punctuation+/, 'keyword'],

        // text between square brackets
        [/\[([^\]]+)\]/, 'label'],

        // text between brackets
        [/\(([^)]+)\)/, 'link'],
      ],

      dialogue: [
        [/[^.,?;!"-]+/, 'dialogue'],
        [/@punctuation+/, 'keyword'],
        [/"/, 'dialogue', '@pop'],
      ],

      italic_dialogue: [
        [/[^.,?;!"-]+/, 'italic-dialogue'],
        [/@punctuation+/, 'italic-keyword'],
        [/"/, 'italic-dialogue', '@pop'],
      ],

      thought: [
        [/'(?=\s)|'$/, 'thought', '@pop'],
        [/[^.,?;!-]+/, 'thought'],
        [/@punctuation+/, 'keyword'],
      ],

      italic_thought: [
        [/'(?=\s)|'$/, 'italic-thought', '@pop'],
        [/[^.,?;!-]+/, 'italic-thought'],
        [/@punctuation+/, 'italic-keyword'],
      ],

      flashback: [
        [/\*(?=\s)/, 'italic', '@pop'],
        // dialogues (text between double quotes)
        [/"/, 'italic-dialogue', '@italic_dialogue'],
        // thoughts (text between single quotes)
        [/^'/, 'italic-thought', '@italic_thought'],
        [/\s+'/, 'italic-thought', '@italic_thought'],
        // punctuation
        [/@punctuation+/, 'italic-keyword'],
        [/./, 'italic'],
      ],
    }
  });
}
