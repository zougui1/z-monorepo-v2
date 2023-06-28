import { UserQuery } from './UserQuery';
import { User } from './User';
import { Source } from '../../../enums';

describe('UserQuery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    describe('when a user was found', () => {
      it('should return the user', async () => {
        const user: User = {
          id: 'zougui',
          name: 'Zougui',
          profileUrl: 'https://furaffinity.net/user/zougui',
          source: Source.Furaffinity,
        };

        jest.spyOn(User.Model, 'findOne').mockResolvedValue({
          toObject: () => ({
            ...user,
            _id: 'kfdbnjrufhguiodr',
          }),
        });
        jest.spyOn(User.Model, 'create');

        const result = await new UserQuery().findOrCreate(user);

        expect(result).toEqual({
          ...user,
          _id: 'kfdbnjrufhguiodr',
        });
        expect(User.Model.findOne).toBeCalledWith({ id: user.id });
        expect(User.Model.create).not.toBeCalled();
      });
    });

    describe('when no user was found', () => {
      it('should create a new user and return it', async () => {
        const user: User = {
          id: 'zougui',
          name: 'Zougui',
          profileUrl: 'https://furaffinity.net/user/zougui',
          source: Source.Furaffinity,
        };

        jest.spyOn(User.Model, 'findOne').mockResolvedValue(undefined);
        // @ts-ignore
        jest.spyOn(User.Model, 'create').mockResolvedValue({
          toObject: () => ({
            ...user,
            _id: 'kfdbnjrufhguiodr',
          }),
        });

        const result = await new UserQuery().findOrCreate(user);

        expect(result).toEqual({
          ...user,
          _id: 'kfdbnjrufhguiodr',
        });
        expect(User.Model.findOne).toBeCalledWith({ id: user.id });
        expect(User.Model.create).toBeCalledWith(user);
      });
    });
  });
});
