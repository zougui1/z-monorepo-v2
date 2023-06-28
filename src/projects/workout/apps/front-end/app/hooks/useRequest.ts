import { useRef } from 'react';
import {
  useRequest as useAlovaRequest,
  type Method,
  type RequestHookConfig,
  type UseHookReturnType,
} from 'alova';

export const useRequest = <Data, S, E, R, T, RC, RE, RH>(
  method: MethodHandler<Data, S, E, R, T, RC, RE, RH>,
  config?: RequestHookConfig<S, E, R, T, RC, RE, RH>,
): UseRequestResult<Data, S, E, R, T, RC, RE, RH> => {
  const dataRef = useRef<Data>();
  const request = useAlovaRequest(() => method(dataRef.current as Data), config);

  const send = (data: Data): Promise<R> => {
    dataRef.current = data;
    return request.send();
  }

  return {
    ...request,
    send,
  };
}

export type MethodHandler<Data, S, E, R, T, RC, RE, RH> = (data: Data) => Method<S, E, R, T, RC, RE, RH>;
export interface UseRequestResult<Data, S, E, R, T, RC, RE, RH> extends Omit<UseHookReturnType<S, E, R, T, RC, RE, RH>, 'send'> {
  send: (data: Data) => Promise<R>;
}
