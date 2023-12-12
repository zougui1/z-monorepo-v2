import { Pgrep } from './Pgrep';

export namespace Game {
  export const name = 'RotMG';

  export const getAllPids = async (): Promise<number[]> => {
    return await Pgrep.getManyPids(name);
  }

  export const getPid = async (): Promise<number> => {
    // first is game launcher PID
    const [_, pid] = await getAllPids();

    if (!pid) {
      throw new Error(`${name} is not running`);
    }

    return pid;
  }

  export const getIsRunning = async (): Promise<boolean> => {
    return Boolean(await getPid());
  }
}
