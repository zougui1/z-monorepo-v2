import { useEffect, useRef } from 'react';

import { createDecorations } from '../utils';
import { useEditor, type UseEditorResult } from '../../../hooks';

export const useTabEditor = (paneId: string): UseTabEditorResult => {
  const dispose = useRef<(() => void) | undefined>();

  const { monaco, editor, onMount } = useEditor({
    onChange: editor => {
      dispose.current?.();

      if(!monaco) {
        return;
      }

      const model = editor.getModel();

      if (!model) {
        return;
      }

      dispose.current = createDecorations({
        editor,
        model,
        monaco,
        paneId,
      });
    },
  });

  useEffect(() => {
    return () => {
      dispose.current?.();
    }
  }, []);

  return {
    monaco,
    editor,
    onMount,
  };
}

export interface UseTabEditorResult extends UseEditorResult {

}
