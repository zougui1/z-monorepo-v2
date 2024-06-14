import type { Request, Response, NextFunction } from 'express';

import { parseContractParams, type InferContractData } from '@zougui/common.ts-rest.core';

import type { HandledContract } from './HandledContract';

export const useContract = <Contract extends HandledContract>(contract: Contract) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = await parseContractParams(contract, req);

    try {
      const result = await contract.handler(data as any as InferContractData<Contract>, req, res);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  };
}
