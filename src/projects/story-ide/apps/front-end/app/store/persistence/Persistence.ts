import type { AppState } from '../store';

export interface Persistence {
  get(): Promise<AppState | undefined>;
  set(state: AppState): Promise<void>;
  delete(): Promise<void>;
}
