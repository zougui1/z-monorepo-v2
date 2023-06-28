import { useEffect, useState, useRef } from 'react';
import { useMonaco } from '@monaco-editor/react';
import type { editor as Editor, IDisposable } from 'monaco-editor';

import * as zdown from '../languages/zdown';
import type { Monaco } from '../types';

export const useEditor = (options?: UseEditorOptions | undefined): UseEditorResult => {
  const monaco = useMonaco();
  const [activeMonaco, setActiveMonaco] = useState<Monaco | null>(null);
  const editorRef = useRef<Editor.IStandaloneCodeEditor | undefined>();
  const subscriptionRef = useRef<IDisposable | undefined>();

  useEffect(() => {
    if(!monaco) {
      return;
    }

    zdown.register(monaco);
    setActiveMonaco(monaco);
  }, [monaco]);

  const onMount = (editor: Editor.IStandaloneCodeEditor): void => {
    editorRef.current = editor;
    options?.onChange?.(editorRef.current, editor.getValue());

    subscriptionRef.current?.dispose();
    subscriptionRef.current = editorRef.current?.onDidChangeModelContent(() => {
      if (editorRef.current) {
        options?.onChange?.(editorRef.current, editorRef.current.getValue());
      }
    });
  }

  return {
    monaco: activeMonaco,
    editor: editorRef,
    onMount,
  };
}

export interface UseEditorResult {
  monaco: Monaco | null;
  editor: React.MutableRefObject<Editor.IStandaloneCodeEditor | undefined>;
  onMount: (editor: Editor.IStandaloneCodeEditor) => void;
}

export interface UseEditorOptions {
  onChange: (editor: Editor.IStandaloneCodeEditor, value: string | undefined) => void;
}
