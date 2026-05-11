import { Router } from 'express';
import type { Reservation, Resource, User } from '../domain/types.js';
import { connectToDatabase } from '../db/mongo.js';

const router = Router();

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
		availabilityWindows: [
			{
				start: '2026-05-20T09:00:00.000Z',
				end: '2026-05-20T12:30:00.000Z'
			},
			{
				start: '2026-05-20T14:00:00.000Z',
				end: '2026-05-20T17:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_2',
		name: 'Conference Room B',
		type: 'room',
		location: 'Building B, Floor 2',
		capacity: 15,
		availabilityWindows: [
			{
				start: '2026-05-21T09:00:00.000Z',
				end: '2026-05-21T11:30:00.000Z'
			},
			{
				start: '2026-05-21T13:00:00.000Z',
				end: '2026-05-21T16:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_3',
		name: 'Computer Science Laboratory',
		type: 'laboratory',
		location: 'Building C, Room 105',
		capacity: 30,
		availabilityWindows: [
			{
				start: '2026-05-22T08:00:00.000Z',
				end: '2026-05-22T12:30:00.000Z'
			},
			{
				start: '2026-05-22T13:30:00.000Z',
				end: '2026-05-22T16:30:00.000Z'
			}
		]
	},
	{
		id: 'resource_4',
		name: 'Projector Kit',
		type: 'equipment',
		location: 'Administrative Office',
		capacity: 1,
		availabilityWindows: [
			{
				start: '2026-05-23T09:00:00.000Z',
				end: '2026-05-23T12:00:00.000Z'
			},
			{
				start: '2026-05-23T13:00:00.000Z',
				end: '2026-05-23T16:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_5',
		name: 'Bicycle',
		type: 'equipment',
		location: 'Campus Storage Room',
		capacity: 1,
		availabilityWindows: [
			{
				start: '2026-05-24T08:00:00.000Z',
				end: '2026-05-24T12:30:00.000Z'
			},
			{
				start: '2026-05-24T14:00:00.000Z',
				end: '2026-05-24T18:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_6',
		name: 'Christmas Tree',
		type: 'equipment',
		location: 'Events Storage Area',
		capacity: 1,
		availabilityWindows: [
			{
				start: '2026-05-26T09:00:00.000Z',
				end: '2026-05-26T16:00:00.000Z'
			},
			{
				start: '2026-05-27T09:00:00.000Z',
				end: '2026-05-27T16:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_7',
		name: 'PlayStation',
		type: 'equipment',
		location: 'Student Recreation Room',
		capacity: 4,
		availabilityWindows: [
			{
				start: '2026-05-28T10:00:00.000Z',
				end: '2026-05-28T17:00:00.000Z'
			},
			{
				start: '2026-05-29T10:00:00.000Z',
				end: '2026-05-29T15:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_8',
		name: 'DVD',
		type: 'equipment',
		location: 'Media Library',
		capacity: 1,
		availabilityWindows: [
			{
				start: '2026-05-30T09:00:00.000Z',
				end: '2026-05-30T16:00:00.000Z'
			},
			{
				start: '2026-05-31T10:00:00.000Z',
				end: '2026-05-31T12:00:00.000Z'
			}
		]
	},
	{
		id: 'resource_9',
		name: 'Guided Building Tour',
		type: 'tour',
		location: 'Main Historical Building',
		capacity: 12,
		availabilityWindows: [
			{
				start: '2026-06-01T09:00:00.000Z',
				end: '2026-06-01T12:00:00.000Z'
			},
			{
				start: '2026-06-01T14:00:00.000Z',
				end: '2026-06-01T16:00:00.000Z'
			},
			{
				start: '2026-06-02T09:30:00.000Z',
				end: '2026-06-02T14:00:00.000Z'
			}
		]
	}
];

const reservations: Reservation[] = [];

router.post('/', async (_req, res) => {
	try {
		const db = await connectToDatabase();

		await db.collection('users').deleteMany({});
		await db.collection('resources').deleteMany({});
		await db.collection('reservations').deleteMany({});

		await db.collection<User>('users').insertMany(users);
		await db.collection<Resource>('resources').insertMany(resources);

		res.json({
			success: true,
			message: 'Database seeded successfully with users, resources and availability windows.',
			inserted: {
				users: users.length,
				resources: resources.length,
				reservations: reservations.length
			}
		});
	} catch (error) {
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

export default router;