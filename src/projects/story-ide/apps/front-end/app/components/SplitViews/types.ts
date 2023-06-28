import type { Bounding } from '../ElementResizer';

export interface GridData<T = unknown> {
  id: string;
  direction: 'horizontal' | 'vertical';
  views: (ViewData<T> | GridData<T>)[];
}

export interface ViewData<T = unknown> {
  id: string;
  data: T;
}

export interface InternalViewData extends Bounding {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
