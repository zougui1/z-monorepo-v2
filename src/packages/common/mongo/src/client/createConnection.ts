import mongoose from 'mongoose';

const connectionAlreadyCreatedStates = [
  mongoose.ConnectionStates.connected,
  mongoose.ConnectionStates.connecting,
  mongoose.ConnectionStates.disconnecting,
];

export const createConnection = (uri: string, options?: mongoose.ConnectOptions | undefined): mongoose.Connection => {
  if (connectionAlreadyCreatedStates.includes(mongoose.connection.readyState)) {
    return mongoose.createConnection(uri, options);
  }

  mongoose.connect(uri, options);
  return mongoose.connection;
}
