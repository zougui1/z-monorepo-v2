import type { InferContractData, AnyContract } from '@zougui/common.ts-rest.core';

import type { RequestOptions } from './types';

export const getDataAndOptions = <Contract extends AnyContract>(
  dataOrOptions?: InferContractData<Contract> | RequestOptions | undefined,
  options?: RequestOptions | undefined,
): DataAndOptions<Contract> => {
  if (
    dataOrOptions &&
    typeof dataOrOptions === 'object' && (
      'query' in dataOrOptions ||
      'params' in dataOrOptions ||
      'body' in dataOrOptions ||
      'headers' in dataOrOptions
    )
  ) {
    return {
      data: dataOrOptions as InferContractData<Contract>,
      options,
    };
  }

  return {
    data: undefined,
    options: dataOrOptions,
  };
}

export type DataAndOptions<Contract extends AnyContract> = {
  data: InferContractData<Contract> | undefined;
  options: RequestOptions | undefined;
};
