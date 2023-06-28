import type { IContextBridge } from '@zougui/story-ide.types';

declare global {
  export interface Window {
    electron?: IContextBridge | undefined;
  }
}
