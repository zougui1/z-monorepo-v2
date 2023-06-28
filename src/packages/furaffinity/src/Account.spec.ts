import { Account, AccountOptions } from './Account';

const furaffinityApiMocks = {
  login: jest.fn().mockName('login'),
  user: jest.fn().mockName('user'),
};

jest.mock('furaffinity-api', () => {
  const mock = (name: keyof typeof furaffinityApiMocks): jest.Mock => {
    return jest
      .fn()
      .mockName(name)
      .mockImplementation((...args) => furaffinityApiMocks[name](...args))
  }

  return {
    login: mock('login'),
    user: mock('user'),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Account', () => {
  afterEach(() => {
    furaffinityApiMocks.login.mockReset();
    furaffinityApiMocks.user.mockReset();
  });

  describe('login', () => {
    it('should log in', async () => {
      const options: AccountOptions = {
        cookieA: 'abc',
        cookieB: 'def',
      };

      furaffinityApiMocks.user.mockResolvedValue({ id: 'Zougui' });

      const account = new Account(options);
      await account.login();

      expect(furaffinityApiMocks.login).toBeCalledTimes(1);
      expect(furaffinityApiMocks.login).toBeCalledWith(options.cookieA, options.cookieB);
    });

    it('should log in only once', async () => {
      const options: AccountOptions = {
        cookieA: 'abc',
        cookieB: 'def',
      };

      furaffinityApiMocks.user.mockResolvedValue({ id: 'Zougui' });

      const account = new Account(options);
      await account.login();
      await account.login();
      await account.login();
      await account.login();

      expect(furaffinityApiMocks.login).toBeCalledTimes(1);
      expect(furaffinityApiMocks.login).toBeCalledWith(options.cookieA, options.cookieB);
    });

    it('should fail to log when the current user could not be found', async () => {
      const options: AccountOptions = {
        cookieA: 'abc',
        cookieB: 'def',
      };

      furaffinityApiMocks.user.mockResolvedValue(undefined);

      const account = new Account(options);
      const getResult = () => account.login();

      await expect(getResult).rejects.toThrowError(/could not log you in/i);
    });

    it('should fail to log when the ID of the current user is "guest"', async () => {
      const options: AccountOptions = {
        cookieA: 'abc',
        cookieB: 'def',
      };

      furaffinityApiMocks.user.mockResolvedValue({ id: 'guest' });

      const account = new Account(options);
      const getResult = () => account.login();

      await expect(getResult).rejects.toThrowError(/could not log you in/i);
    });

    it('should be able to try to log in again if the first attempt failed', async () => {
      const options: AccountOptions = {
        cookieA: 'abc',
        cookieB: 'def',
      };

      furaffinityApiMocks.user.mockResolvedValueOnce(undefined);
      furaffinityApiMocks.user.mockResolvedValueOnce({ id: 'Zougui' });

      const account = new Account(options);
      const getResult = () => account.login();

      await expect(getResult).rejects.toThrowError(/could not log you in/i);
      await account.login();

      expect(furaffinityApiMocks.login).toBeCalledTimes(2);
      expect(furaffinityApiMocks.login).toBeCalledWith(options.cookieA, options.cookieB);
    });
  });
});
