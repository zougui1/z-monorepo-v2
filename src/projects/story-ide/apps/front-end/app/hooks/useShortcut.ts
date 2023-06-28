import { useEffect } from 'react';
import { Shortcuts } from 'shortcuts';

export const useShortcut = (options: UseShortcutOptions): void => {
  const { shortcut, handler, getIsDisabled } = options;

  useEffect(() => {
    const shortcuts = new Shortcuts({
      shouldHandleEvent: getIsDisabled
        ? event => !event.defaultPrevented && !getIsDisabled(event)
        : undefined,
    });

    shortcuts.add({
      shortcut: shortcut,
      handler,
    });

    return () => {
      shortcuts.reset();
    }
  }, [shortcut, handler, getIsDisabled]);
}

export interface UseShortcutOptions {
  shortcut: string;
  handler: (event: KeyboardEvent) => void;
  getIsDisabled?: ((event: KeyboardEvent) => boolean) | undefined;
}
