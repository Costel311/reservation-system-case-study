import { json, type RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db/mongo';
import type { Resource, Reservation, User } from '$lib/domain/types';

const users: User[] = [
	{
		id: 'user_1',
		name: 'Andrei Popescu',
		email: 'andrei.popescu@example.com',
		role: 'student'
	},
	{
		id: 'user_2',
		name: 'Maria Ionescu',
		email: 'maria.ionescu@example.com',
		role: 'teacher'
	},
	{
		id: 'user_3',
		name: 'Admin User',
		email: 'admin@example.com',
		role: 'admin'
	}
];

const resources: Resource[] = [
	{
		id: 'resource_1',
		name: 'Computer Science Laboratory',
		type: 'laboratory',
		location: 'Building A, Room 101',
		capacity: 30,
		timeSlots: [
			{
				id: 'slot_1',
				start: '2026-05-10T09:00:00.000Z',
				end: '2026-05-10T10:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_2',
				start: '2026-05-10T10:00:00.000Z',
				end: '2026-05-10T11:00:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_2',
		name: 'Conference Room',
		type: 'room',
		location: 'Building B, Room 205',
		capacity: 15,
		timeSlots: [
			{
				id: 'slot_3',
				start: '2026-05-11T12:00:00.000Z',
				end: '2026-05-11T13:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_4',
				start: '2026-05-11T13:00:00.000Z',
				end: '2026-05-11T14:00:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_3',
		name: 'Projector',
		type: 'equipment',
		location: 'Administrative Office',
		capacity: 1,
		timeSlots: [
			{
				id: 'slot_5',
				start: '2026-05-12T08:00:00.000Z',
				end: '2026-05-12T09:00:00.000Z',
				isAvailable: true
			}
		]
	}
];

const reservations: Reservation[] = [];

export const POST: RequestHandler = async () => {
	const db = await connectToDatabase();

	await db.collection('users').deleteMany({});
	await db.collection('resources').deleteMany({});
	await db.collection('reservations').deleteMany({});

	await db.collection<User>('users').insertMany(users);
	await db.collection<Resource>('resources').insertMany(resources);

	return json({
		success: true,
		message: 'Database seeded successfully.',
		inserted: {
			users: users.length,
			resources: resources.length,
			reservations: reservations.length
		}
	});
};