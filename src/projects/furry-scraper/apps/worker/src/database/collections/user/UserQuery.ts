import { User } from './User';

export class UserQuery {
  async findOrCreate(user: User): Promise<User.Object> {
    const foundUser = await User.Model.findOne({
      id: user.id,
    });

    if (foundUser) {
      return foundUser.toObject();
    }

    const createdUser = await User.Model.create(user);
    return createdUser.toObject();
  }
}
