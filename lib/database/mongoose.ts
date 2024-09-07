import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    console.error('MONGODB_URL is missing');
    throw new Error('MONGODB_URL is missing');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: 'imaginify',
      bufferCommands: false,
    }).catch(err => {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};
