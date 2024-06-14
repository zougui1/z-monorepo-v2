import type { AxiosResponse } from 'axios';

import type {
  AnyContract,
  AnyRouterData,
  InferContractData,
  InferContractResponse as CoreInferContractResponse,
} from '@zougui/common.ts-rest.core';

import type { RequestOptions } from './types';

// checks if the object 'options' is empty
export type InferContract<Contract extends AnyContract> = keyof InferContractData<Contract> extends ''
  ? (options?: RequestOptions | undefined) => Promise<InferContractResponse<Contract>>
  : InferContractData<Contract> extends Partial<Record<string, any>>
    ? (data?: InferContractData<Contract> | undefined, options?: RequestOptions | undefined) => Promise<InferContractResponse<Contract>>
    : (data: InferContractData<Contract>, options?: RequestOptions | undefined) => Promise<InferContractResponse<Contract>>;

export type InferContracts<Router extends AnyRouterData> = {
  [Key in keyof Router['contracts']]: InferContract<Router['contracts'][Key]>;
};

export type InferContractResponse<Contract extends AnyContract> = AxiosResponse<CoreInferContractResponse<Contract>>;

export type InferRouter<Router extends AnyRouterData> = InferContracts<Router> & InferRouters<Router>;
export type InferRouters<Router extends AnyRouterData> = {
  [Key in keyof Router['routers']]: InferRouter<Router['routers'][Key]>;
};
