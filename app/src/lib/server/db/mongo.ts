import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI, MONGODB_DB } from '$env/static/private';

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
	if (db) {
		return db;
	}

	if (!MONGODB_URI) {
		throw new Error('MONGODB_URI is not defined');
	}

	if (!MONGODB_DB) {
		throw new Error('MONGODB_DB is not defined');
	}

	client = new MongoClient(MONGODB_URI);
	await client.connect();

	db = client.db(MONGODB_DB);

	return db;
}