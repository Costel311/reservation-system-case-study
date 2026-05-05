import { MongoClient, type Db } from 'mongodb';
import { env } from '$env/dynamic/private';

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase(): Promise<Db> {
	if (db) {
		return db;
	}

	const uri = env.MONGODB_URI;
	const dbName = env.MONGODB_DB;

	if (!uri) {
		throw new Error('MONGODB_URI is not defined');
	}

	if (!dbName) {
		throw new Error('MONGODB_DB is not defined');
	}

	client = new MongoClient(uri);
	await client.connect();

	db = client.db(dbName);

	return db;
}