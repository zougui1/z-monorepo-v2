import { setTimeout } from 'node:timers/promises';

import { onceProgramExit } from './onceProgramExit';

const maxTimeout = 2_147_483_647;

class ProcessExitScheduler {
  #tasks: Set<Promise<unknown>> = new Set();
  #waitingExit: boolean = false;
  #started: boolean = false;
  #cleanup: (() => void) | undefined;

  start(): this {
    if (this.#started) {
      return this;
    }

    this.#started = true;
    this.#cleanup = onceProgramExit(async () => {
      this.#waitingExit = true;

      try {
        await Promise.all([...this.#tasks]);
      } finally {
        process.exit();
      }
    });

    return this;
  }

  stop(): this {
    this.#cleanup?.();
    this.#cleanup = undefined;
    this.#started = false;
    return this;
  }

  async addTask<T>(task: Promise<T>): Promise<T> {
    task.finally(() => this.#tasks.delete(task));
    this.#tasks.add(task);

    // locks the rest of the scope until the program exits
    if (this.#waitingExit) {
      return await setTimeout(maxTimeout);
    }

    return task;
  }
}

export const processExitScheduler = new ProcessExitScheduler();
