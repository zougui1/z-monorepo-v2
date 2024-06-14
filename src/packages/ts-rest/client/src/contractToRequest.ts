import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  parseContractParams,
  methodsWithBody,
  type InferContractData,
  type AnyContract,
} from '@zougui/common.ts-rest.core';

import { buildUrl } from './buildUrl';
import { getDataAndOptions } from './getDataAndOptions';
import type { RequestOptions } from './types';
import type { InferContract, InferContractResponse } from './InferContract';

export const contractToRequest = <Contract extends AnyContract>(axios: AxiosInstance, contract: Contract): InferContract<Contract> => {
  return async (
    dataOrOptions?: InferContractData<Contract> | RequestOptions | undefined,
    maybeOptions?: RequestOptions | undefined,
  ): Promise<InferContractResponse<Contract>> => {
    const { data, options } = getDataAndOptions(dataOrOptions, maybeOptions);

    const {
      query,
      params,
      body,
      headers,
    } = await parseContractParams(contract, data);

    const url = buildUrl({
      params,
      query,
      path: contract.path,
    });

    const config: AxiosRequestConfig = {
      ...options,
      headers: headers as Record<string, string>,
    };

    const isRequestWithBody = methodsWithBody.includes(contract.method);
    const bodyOrConfig = isRequestWithBody ? body : config;
    const maybeConfig = isRequestWithBody ? config : undefined;

    const response = await axios[contract.method](
      url,
      bodyOrConfig,
      maybeConfig,
    );

    const responseData = contract.response
      ? await contract.response.parseAsync(response.data)
      : undefined;

    return {
      ...response,
      data: responseData,
    };
  }
}
