import type { Reservation, Resource, SystemState, User } from '../domain/types.js';
import { connectToDatabase } from './mongo.js';

export async function loadStateFromMongo(): Promise<SystemState> {
	const db = await connectToDatabase();

	const users = await db.collection<User>('users').find().toArray();
	const resources = await db.collection<Resource>('resources').find().toArray();
	const reservations = await db.collection<Reservation>('reservations').find().toArray();

	return {
		users,
		resources,
		reservations
	};
}

export async function saveStateToMongo(state: SystemState): Promise<void> {
	const db = await connectToDatabase();

	await db.collection('users').deleteMany({});
	await db.collection('resources').deleteMany({});
	await db.collection('reservations').deleteMany({});

	if (state.users.length > 0) {
		await db.collection<User>('users').insertMany(state.users);
	}

	if (state.resources.length > 0) {
		await db.collection<Resource>('resources').insertMany(state.resources);
	}

	if (state.reservations.length > 0) {
		await db.collection<Reservation>('reservations').insertMany(state.reservations);
	}
}