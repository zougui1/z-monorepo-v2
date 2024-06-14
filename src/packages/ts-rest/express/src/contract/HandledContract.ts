import type { Request, Response } from 'express';

import type { AnyContract, InferContractData, InferContractResponse, AnyRouterData, UnknownContractData } from '@zougui/common.ts-rest.core';

export type ContractHandler<Contract extends AnyContract> = (data: InferContractData<Contract>, req: Request, res: Response) => (ContractHandlerResult<Contract> | Promise<ContractHandlerResult<Contract>>);

export type ContractHandlerResult<Contract extends AnyContract> = { status: number; body: InferContractResponse<Contract>; };

export type HandledContract<Contract extends AnyContract = AnyContract> = Contract & {
  handler: ContractHandler<Contract>;
};

export type ContractEntry<Router extends AnyRouterData> = [keyof Router['contracts'], Router['contracts'][keyof Router['contracts']]];

export type UnknownContractHandler<Contract extends AnyContract> = (data: UnknownContractData, req: Request, res: Response) => (ContractHandlerResult<Contract> | Promise<ContractHandlerResult<Contract>>);

export type HandledUnknownContract<Contract extends AnyContract = AnyContract> = Contract & {
  handler: UnknownContractHandler<Contract>;
};
