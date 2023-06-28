import { nanoid } from 'nanoid';
import type zod from 'zod';

import type { ElectronRequest, RouteDefinition } from '@zougui/story-ide.types';

class Electron {
  request = <TParams extends zod.ZodType, TResponse extends zod.ZodType>(
    definition: RouteDefinition<TParams, TResponse>,
    data: zod.infer<TParams>,
  ): Promise<ElectronResponse<zod.infer<TResponse>>> => {
    return new Promise((resolve, reject) => {
      if (!window.electron) {
        return reject(new Error('No electron process'));
      }

      const request: ElectronRequest = {
        headers: { id: nanoid() },
        body: data,
      };

      const offSuccess = window.electron.on(`${definition.fullPath}.success`, async (event, response) => {
        if (response.headers.id === request.headers.id) {
          try {
            const data = await definition.response.parseAsync(response.body);

            resolve({
              ...response,
              data,
            });
          } catch (error) {
            console.error(error);
            reject(error);
          } finally {
            cleanup();
          }
        }
      });

      const offError = window.electron.on(`${definition.fullPath}.error`, (event, response) => {
        if (response.headers.id === request.headers.id) {
          console.log('error', response.body)
          cleanup();
          reject(response);
        }
      });

      const cleanup = () => {
        offSuccess();
        offError();
      }

      window.electron.send(definition.fullPath, request);
    });
  }
}

export const electron = new Electron();

export interface ElectronResponse<T> extends Omit<ElectronRequest<T>, 'body'> {
  data: T;
}
