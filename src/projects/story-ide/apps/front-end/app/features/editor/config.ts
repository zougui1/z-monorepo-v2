import type { editor } from 'monaco-editor';

export const config: editor.IStandaloneEditorConstructionOptions = {
  wordWrapColumn: 80,
  letterSpacing: 0.2,
  smoothScrolling: true,
  tabSize: 2,
  cursorBlinking: 'smooth',
  minimap: {
    maxColumn: 100,
  },
  folding: true,
  wordWrap: 'on',
  automaticLayout: true,
};
