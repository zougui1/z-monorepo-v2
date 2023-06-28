import { CaseReducerActions, SliceCaseReducers } from '@reduxjs/toolkit';

export type OverridenActions<
  T extends CaseReducerActions<SliceCaseReducers<any>, string> = CaseReducerActions<SliceCaseReducers<any>, string>,
> = {
  // if the action creator expects a non-void payload then don't require a payload
  [ActionName in keyof T]: T[ActionName] extends (payload: infer P) => any
    ? P extends void
      ? () => ReturnType<T[ActionName]>
      : (...args: Parameters<T[ActionName]>) => ReturnType<T[ActionName]>
    : () => ReturnType<T[ActionName]>;
}

export const createAutoDispatchedActions = <
  T extends CaseReducerActions<SliceCaseReducers<any>, string> = CaseReducerActions<SliceCaseReducers<any>, string>,
>(actions: T, dispatch: (action: ReturnType<T[keyof T]>) => void): OverridenActions<T> => {
  return Object.entries(actions as any).reduce((actions, [actionName, currentAction]) => {
    return {
      ...actions,
      [actionName]: (...args: Parameters<T[keyof T]>) => {
        dispatch((currentAction as any)(...args));
      },
    };
  }, {} as OverridenActions<T>);
}
