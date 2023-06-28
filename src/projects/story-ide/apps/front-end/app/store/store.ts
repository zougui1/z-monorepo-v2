import { type ThunkAction, type Action } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import type { createStore } from './createStore';
import { StoreManager } from './StoreManager';

export const store = new StoreManager();

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
export type AppState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
