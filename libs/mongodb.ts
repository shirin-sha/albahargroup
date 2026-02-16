import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const defaultDbName = process.env.MONGODB_DB || "albahargroup";

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your .env file",
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options: MongoClientOptions = {};

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(dbName: string = defaultDbName): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

