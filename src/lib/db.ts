import { Db, MongoClient } from "mongodb";
import config from "../config";

let client: MongoClient | undefined;
let database: Db | undefined;

export const connectDB = async () => {
  client = new MongoClient(config.database_url);
  await client.connect();
  database = client.db();
  await database.command({ ping: 1 });

  console.log("MongoDB connected successfully");
};

export const getDb = () => {
  if (!database) {
    throw new Error("MongoDB has not been connected");
  }

  return database;
};