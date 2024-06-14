import { createContext } from 'react';
import { createSlice, CreateSliceOptions, Slice, SliceCaseReducers } from '@reduxjs/toolkit';

import { createReducerProvider, createSliceHooks, OverridenActions, SliceContextProviderProps } from './utils';
import { InternalSliceState } from './types';

export function createContextStore<
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
>(options: CreateSliceContextOptions<State, CR, Name> & { initialState?: undefined }): SliceContextRequiredDefaultState<State, CR, Name>;
export function createContextStore<
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
>(options: CreateSliceContextOptions<State, CR, Name>): SliceContext<State, CR, Name>
export function createContextStore<
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
>(options: CreateSliceContextOptions<State, CR, Name>): SliceContext<State, CR, Name> {
  const initialState = typeof options.initialState === 'function'
    ? (options.initialState as (() => State))()
    : options.initialState;

  const slice = createSlice({
    initialState: {} as any,
    ...options,
  });
  const Context = createContext<InternalSliceState<State, CR> | undefined>(undefined);
  Context.displayName = options.name;

  const SliceContextProvider = createReducerProvider({
    Context,
    reducer: slice.reducer,
    actions: slice.actions,
    initialState,
  });

  const {
    useSliceSelector,
    useSliceActions,
  } = createSliceHooks<State, CR>(Context, options.name);

  return {
    slice,
    Provider: SliceContextProvider,
    useSelector: useSliceSelector,
    useActions: useSliceActions,
  };
}

export interface CreateSliceContextOptions<
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
> extends Omit<CreateSliceOptions<State, CR, Name>, 'initialState'> {
  initialState?: State | (() => State) | undefined;
}

export interface SliceContext<
  State extends Record<string, any> = Record<string, any>,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
> {
  Provider: (props: SliceContextProviderProps<State>) => JSX.Element;
  slice: Slice<State, CaseReducers, Name>;
  useSelector: <T>(selector: ((state: State) => T)) => T;
  useActions: () => OverridenActions<Slice<State, CaseReducers>['actions']>;
}

export interface SliceContextRequiredDefaultState<
  State extends Record<string, any> = Record<string, any>,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
> extends Omit<SliceContext<State, CaseReducers, Name>, 'Provider'> {
  Provider: (props: SliceContextProviderProps<State> & { defaultState: State }) => JSX.Element;
}
