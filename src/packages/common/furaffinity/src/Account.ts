import { login, user as findCurrentUser } from 'furaffinity-api';

export class Account {
  readonly #cookieA: string;
  readonly #cookieB: string;
  #loggedIn: boolean = false;

  constructor(options: AccountOptions) {
    this.#cookieA = options.cookieA;
    this.#cookieB = options.cookieB;
  }

  async login(): Promise<void> {
    if (this.#loggedIn) {
      return;
    }

    login(this.#cookieA, this.#cookieB);
    const user = await findCurrentUser();

    if (!user || user.id === 'guest') {
      throw new Error('Could not log you in');
    }

    this.#loggedIn = true;
  }
}

export interface AccountOptions {
  cookieA: string;
  cookieB: string;
}
