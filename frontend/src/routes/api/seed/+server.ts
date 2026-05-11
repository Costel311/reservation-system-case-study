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
	},
	{
		id: 'resource_5',
		name: 'Bicycle',
		type: 'equipment',
		location: 'Campus Storage Room',
		capacity: 1,
		timeSlots: [
			{
				id: 'slot_12',
				start: '2026-05-24T08:00:00.000Z',
				end: '2026-05-24T10:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_13',
				start: '2026-05-24T10:30:00.000Z',
				end: '2026-05-24T12:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_14',
				start: '2026-05-24T14:00:00.000Z',
				end: '2026-05-24T16:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_15',
				start: '2026-05-25T09:00:00.000Z',
				end: '2026-05-25T11:00:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_6',
		name: 'Christmas Tree',
		type: 'equipment',
		location: 'Events Storage Area',
		capacity: 1,
		timeSlots: [
			{
				id: 'slot_16',
				start: '2026-05-26T09:00:00.000Z',
				end: '2026-05-26T12:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_17',
				start: '2026-05-26T13:00:00.000Z',
				end: '2026-05-26T16:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_18',
				start: '2026-05-27T09:00:00.000Z',
				end: '2026-05-27T12:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_19',
				start: '2026-05-27T13:00:00.000Z',
				end: '2026-05-27T16:00:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_7',
		name: 'PlayStation',
		type: 'equipment',
		location: 'Student Recreation Room',
		capacity: 4,
		timeSlots: [
			{
				id: 'slot_20',
				start: '2026-05-28T10:00:00.000Z',
				end: '2026-05-28T12:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_21',
				start: '2026-05-28T12:30:00.000Z',
				end: '2026-05-28T14:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_22',
				start: '2026-05-28T15:00:00.000Z',
				end: '2026-05-28T17:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_23',
				start: '2026-05-29T10:00:00.000Z',
				end: '2026-05-29T12:00:00.000Z',
				isAvailable: true
			}
		]
	},
	{
		id: 'resource_8',
		name: 'DVD',
		type: 'equipment',
		location: 'Media Library',
		capacity: 1,
		timeSlots: [
			{
				id: 'slot_24',
				start: '2026-05-30T09:00:00.000Z',
				end: '2026-05-30T11:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_25',
				start: '2026-05-30T11:30:00.000Z',
				end: '2026-05-30T13:30:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_26',
				start: '2026-05-30T14:00:00.000Z',
				end: '2026-05-30T16:00:00.000Z',
				isAvailable: true
			},
			{
				id: 'slot_27',
				start: '2026-05-31T10:00:00.000Z',
				end: '2026-05-31T12:00:00.000Z',
				isAvailable: true
			}
		]
	},
	{
	id: 'resource_9',
	name: 'Guided Building Tour',
	type: 'tour',
	location: 'Main Historical Building',
	capacity: 12,
	timeSlots: [
		{
			id: 'slot_28',
			start: '2026-06-01T09:00:00.000Z',
			end: '2026-06-01T10:00:00.000Z',
			isAvailable: true
		},
		{
			id: 'slot_29',
			start: '2026-06-01T11:00:00.000Z',
			end: '2026-06-01T12:00:00.000Z',
			isAvailable: true
		},
		{
			id: 'slot_30',
			start: '2026-06-01T14:00:00.000Z',
			end: '2026-06-01T15:00:00.000Z',
			isAvailable: true
		},
		{
			id: 'slot_31',
			start: '2026-06-02T09:30:00.000Z',
			end: '2026-06-02T10:30:00.000Z',
			isAvailable: true
		},
		{
			id: 'slot_32',
			start: '2026-06-02T13:00:00.000Z',
			end: '2026-06-02T14:00:00.000Z',
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