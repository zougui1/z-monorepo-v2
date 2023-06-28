import mongoose from 'mongoose';

export const connect = async (uri: string): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}
