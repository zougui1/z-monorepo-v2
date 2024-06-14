import { AccountOptions } from './Account';
import { Submission } from './submission';

export class Furaffinity {
  readonly submission: Submission;

  constructor(options: FuraffinityOptions) {
    this.submission = new Submission(options);
  }
}

export interface FuraffinityOptions extends AccountOptions {

}
