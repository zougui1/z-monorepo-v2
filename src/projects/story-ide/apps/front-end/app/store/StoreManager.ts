import { clearAllListeners } from '@reduxjs/toolkit';

import { isWeb } from 'app/utils';

import { createStore } from './createStore';
import type { Store, AppState, AppDispatch } from './store';
import { WebPersistence, type Persistence } from './persistence';

export class StoreManager {
  #listeners: Set<() => void> = new Set();
  #internalUnsubscribe: (() => void) | undefined;
  #canSubscribe: boolean = false;
  #persistence: Persistence = new WebPersistence();
  store: Store = createStore();

  constructor() {
    this.internalSubscribe(store => this.persistState(store));
    this.#canSubscribe = true;
    this.callListeners();

    if (isWeb) {
      window.addEventListener('keydown', async e => {
        if (e.key === 'r' && e.ctrlKey) {
          e.preventDefault();
          await this.#persistence.delete();
          window.location.reload();
        }
      });
    }
  }

  getState = (): AppState => {
    return this.store.getState();
  }

  dispatch = (...args: Parameters<AppDispatch>): ReturnType<Store['dispatch']> => {
    return this.store.dispatch(...args);
  }

  subscribe = (listener: () => void): (() => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    }
  }

  requestState = async (): Promise<void> => {
    this.#canSubscribe = false;

    try {
      const state = await this.#persistence.get();

      if(!state) {
        return;
      }

      this.store = createStore(state);
      clearAllListeners();
    } finally {
      this.#canSubscribe = true;

      this.internalSubscribe(this.persistState);
      this.callListeners();
    }
  }

  private persistState = async (store: Store): Promise<void> => {
    await this.#persistence.set(store.getState());
  }

  private callListeners(): void {
    this.#listeners.forEach(listener => listener());
  }

  private internalSubscribe(listener: (store: Store) => void): void {
    if(!this.#canSubscribe) {
      return;
    }

    const store = this.store;

    this.#internalUnsubscribe?.();
    this.#internalUnsubscribe = store.subscribe(() => {
      listener(store);
    });
  }
}
