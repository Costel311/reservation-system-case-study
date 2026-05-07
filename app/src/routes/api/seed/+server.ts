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
	},
	{
		id: 'user_4',
		name: 'Guest User',
		email: 'guest@example.com',
		role: 'guest'
	}
];

const resources: Resource[] = [
	{
		id: 'resource_1',
		name: 'Conference Room A',
		type: 'room',
		location: 'Building A, Floor 1',
		capacity: 20,
		timeSlots: [
			{
				id: 'slot_1',
				start: '2026-05-20T09:00:00.000Z',
				end: '2026-05-20T10:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_2',
				start: '2026-05-20T11:00:00.000Z',
				end: '2026-05-20T12:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_3',
				start: '2026-05-20T14:00:00.000Z',
				end: '2026-05-20T15:30:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_2',
		name: 'Conference Room B',
		type: 'room',
		location: 'Building B, Floor 2',
		capacity: 15,
		timeSlots: [
			{
				id: 'slot_4',
				start: '2026-05-21T09:00:00.000Z',
				end: '2026-05-21T10:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_5',
				start: '2026-05-21T10:30:00.000Z',
				end: '2026-05-21T11:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_6',
				start: '2026-05-21T13:00:00.000Z',
				end: '2026-05-21T14:30:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_3',
		name: 'Computer Science Laboratory',
		type: 'laboratory',
		location: 'Building C, Room 105',
		capacity: 30,
		timeSlots: [
			{
				id: 'slot_7',
				start: '2026-05-22T08:00:00.000Z',
				end: '2026-05-22T10:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_8',
				start: '2026-05-22T10:30:00.000Z',
				end: '2026-05-22T12:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_9',
				start: '2026-05-22T13:30:00.000Z',
				end: '2026-05-22T15:30:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_4',
		name: 'Projector Kit',
		type: 'equipment',
		location: 'Administrative Office',
		capacity: 1,
		timeSlots: [
			{
				id: 'slot_10',
				start: '2026-05-23T09:00:00.000Z',
				end: '2026-05-23T12:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_11',
				start: '2026-05-23T13:00:00.000Z',
				end: '2026-05-23T16:00:00.000Z',
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
		message: 'Database seeded successfully with users, resources and available time slots.',
		inserted: {
			users: users.length,
			resources: resources.length,
			reservations: reservations.length
		}
	});
};