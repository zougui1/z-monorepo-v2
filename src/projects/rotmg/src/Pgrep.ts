import execa from 'execa';
import { isNumber } from 'radash';

export namespace Pgrep {
  export const getManyPids = async (name: string): Promise<number[]> => {
    try {
      const { stdout } = await execa('pgrep', [name]);
      return stdout.split('\n').map(Number).filter(isNumber);
    } catch {
      return [];
    }
  }
}
