import { MongoClient, type Db } from 'mongodb';

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase(): Promise<Db> {
	if (db) {
		return db;
	}

	const uri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB;

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

export async function closeDatabaseConnection(): Promise<void> {
	if (client) {
		await client.close();
		client = undefined;
		db = undefined;
	}
}