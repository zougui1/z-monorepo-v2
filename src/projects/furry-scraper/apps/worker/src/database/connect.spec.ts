import mongoose from 'mongoose';

import { connect } from './connect';

describe('enumProp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('connect to mongo', async () => {
    const uri = 'mongodb://localhost:27017';
    jest.spyOn(mongoose, 'connect').mockResolvedValue(mongoose);

    await connect(uri);

    expect(mongoose.connect).toBeCalledWith(uri);
  });
});
