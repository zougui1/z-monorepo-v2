import type { AxiosRequestConfig } from 'axios';

export type RequestOptions = Omit<AxiosRequestConfig, 'params' | 'data' | 'headers' | 'baseURL' | 'url'>;
