import type { useMonaco } from '@monaco-editor/react';

export type Monaco = NonNullable<ReturnType<typeof useMonaco>>;
