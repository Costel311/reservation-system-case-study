import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { connectToDatabase, closeDatabaseConnection } from '../db/mongo.js';
import type { Reservation, Resource, User } from '../domain/types.js';

dotenv.config();

interface SampleData {
	users: User[];
	resources: Resource[];
	reservations: Reservation[];
}

async function loadSampleData(): Promise<SampleData> {
	const sampleDataPath = resolve(process.cwd(), '../database/sample-data.json');
	const fileContent = await readFile(sampleDataPath, 'utf-8');

	return JSON.parse(fileContent) as SampleData;
}

async function seedDatabase() {
	const sampleData = await loadSampleData();
	const db = await connectToDatabase();

	await db.collection('users').deleteMany({});
	await db.collection('resources').deleteMany({});
	await db.collection('reservations').deleteMany({});

	if (sampleData.users.length > 0) {
		await db.collection<User>('users').insertMany(sampleData.users);
	}

	if (sampleData.resources.length > 0) {
		await db.collection<Resource>('resources').insertMany(sampleData.resources);
	}

	if (sampleData.reservations.length > 0) {
		await db.collection<Reservation>('reservations').insertMany(sampleData.reservations);
	}

	console.log('Database seeded successfully.');
	console.log(`Users inserted: ${sampleData.users.length}`);
	console.log(`Resources inserted: ${sampleData.resources.length}`);
	console.log(`Reservations inserted: ${sampleData.reservations.length}`);
}

seedDatabase()
	.catch((error) => {
		console.error('Database seed failed.');
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await closeDatabaseConnection();
	});