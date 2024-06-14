import path from 'node:path';

import fs from 'fs-extra';
import { Semaphore } from 'async-mutex';

import { GarbageNode } from './GarbageNode';

const PARALLELISM = 100;

export class GarbageContainer {
  readonly path: string;
  readonly lifetime: number;

  constructor(path: string, options: GarbageContainerOptions) {
    this.path = path;
    this.lifetime = options.lifetime;
  }

  removeExpiredNodes = async (): Promise<void> => {
    const dir = await fs.opendir(this.path);
    const semaphore = new Semaphore(PARALLELISM);

    for await (const dirent of dir) {
      // no await for concurrency
      semaphore.runExclusive(async () => {
        const filePäth = path.join(this.path, dirent.name);

        const garbage = new GarbageNode(filePäth, {
          lifetime: this.lifetime,
        });

        await garbage.removeIfExpired();
      });
    }

    await semaphore.waitForUnlock();
  }
}

export interface GarbageContainerOptions {
  lifetime: number;
}
