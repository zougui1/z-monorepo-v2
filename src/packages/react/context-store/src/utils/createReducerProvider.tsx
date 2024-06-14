import React, { useMemo, useRef } from 'react';
import { Slice } from '@reduxjs/toolkit';

import { UnknownObject } from '@zougui/common.type-utils';

import { Store } from './Store';
import { createAutoDispatchedActions } from './createAutoDispatchedActions';
import { InternalSliceState } from '../types';

export function createReducerProvider(options: CreateReducerProviderOptions & { initialState?: undefined }): (
  <TState extends UnknownObject>(props: SliceContextProviderProps<TState> & { defaultState: TState }) => JSX.Element
);
export function createReducerProvider(options: CreateReducerProviderOptions): (
  <TState extends UnknownObject>(props: SliceContextProviderProps<TState>) => JSX.Element
);
export function createReducerProvider(options: CreateReducerProviderOptions) {
  const { Context, reducer, initialState } = options;

  function SliceContextProvider<TState extends UnknownObject>({ children, defaultState }: SliceContextProviderProps<TState>) {
    const privateStore = useMemo(() => new Store(reducer, defaultState ?? initialState), []);

    const actions = useMemo(() => {
      return createAutoDispatchedActions(options.actions, privateStore.dispatch)
    }, [privateStore.dispatch]);

    const publicStore = useRef<InternalSliceState>({
      actions,
      getState: privateStore.getState,
      subscribe: privateStore.subscribe,
      dispatch: privateStore.dispatch,
    });

    return (
      <Context.Provider value={publicStore.current}>
        {children}
      </Context.Provider>
    );
  }

  return SliceContextProvider;
}

export interface SliceContextProviderProps<TState = UnknownObject> {
  children?: React.ReactNode | undefined;
  defaultState?: TState | undefined;
}

export interface CreateReducerProviderOptions {
  Context: React.Context<any>;
  reducer: (state: any, action: any) => any;
  initialState?: UnknownObject | undefined;
  actions: Slice['actions'];
}
