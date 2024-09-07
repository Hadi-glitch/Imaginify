import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extending the NodeJS.Global interface to include mongoose property
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Use the cached mongoose connection from the global object if available
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// If the cached connection is not available, initialize it
if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  // If a connection already exists, return it
  if (cached.conn) return cached.conn;

  // If the MongoDB URL is missing, throw an error
  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  // If no promise exists, create a new connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "Imaginify",
      bufferCommands: false,
    });
  }

  // Await the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
};
