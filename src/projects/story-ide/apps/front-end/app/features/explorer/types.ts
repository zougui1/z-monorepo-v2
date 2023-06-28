import type { FS } from '@zougui/story-ide.types';

export type NodeClickEventHandler = (event: React.MouseEvent, node: FS.Node) => void;
