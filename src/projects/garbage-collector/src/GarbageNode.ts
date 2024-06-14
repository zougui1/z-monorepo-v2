import fs from 'fs-extra';

export class GarbageNode {
  readonly path: string;
  readonly lifetime: number;

  constructor(path: string, options: GarbageNodeOptions) {
    this.path = path;
    this.lifetime = options.lifetime;
  }

  getStats = async (): Promise<fs.Stats> => {
    return await fs.stat(this.path);
  }

  getIsExpired = async (): Promise<boolean> => {
    const stats = await this.getStats();
    const maxLife = Date.now() - this.lifetime;

    return stats.mtimeMs <= maxLife;
  }

  remove = async (): Promise<void> => {
    await fs.remove(this.path);
  }

  /**
   * return true if the node has been removed
   */
  removeIfExpired = async (): Promise<boolean> => {
    if (!(await this.getIsExpired())) {
      return false;
    }

    await this.remove();
    return true;
  }
}

export interface GarbageNodeOptions {
  lifetime: number;
}
