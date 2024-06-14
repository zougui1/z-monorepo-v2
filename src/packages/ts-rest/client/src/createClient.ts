import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';

import type { AnyRouterData } from '@zougui/common.ts-rest.core';

import { convertRouter } from './convertRouter';
import type { InferRouter } from './InferContract'

export const createClient = <Router extends AnyRouterData>(
  baseUrl: string,
  router: Router,
  options?: ClientOptions | undefined,
): Client<Router> => {
  const http = axios.create({
    ...options,
    baseURL: baseUrl,
  });
  const routeClient = convertRouter(http, router) as Client<Router>;
  routeClient.http = http;

  return routeClient;
}

export type Client<Router extends AnyRouterData> = InferRouter<Router> & {
  http: AxiosInstance;
};

export type ClientOptions = Omit<CreateAxiosDefaults, 'baseURL'>;
