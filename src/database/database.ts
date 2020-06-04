import Mongoose from 'mongoose';
let database: Mongoose.Connection;

export const connect = (uri: string) => {
  if (database) {
    return;
  }

  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = Mongoose.connection;

  database.on('error', () => {
    console.log('Error connecting to database');
  });

  return database;
};

export const disconnect = () => {
  if (!database) {
    return;
  }

  Mongoose.disconnect();
};
