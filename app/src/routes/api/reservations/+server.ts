import { json, type RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db/mongo';
import { createReservation, type CreateReservationInput } from '$lib/domain/reservation';
import { runState } from '$lib/domain/state';
import type { Reservation, Resource, SystemState, User } from '$lib/domain/types';

type UserDocument = User;
type ResourceDocument = Resource;
type ReservationDocument = Reservation;

async function loadSystemState(): Promise<SystemState> {
	const db = await connectToDatabase();

	const users = await db.collection<UserDocument>('users').find().toArray();
	const resources = await db.collection<ResourceDocument>('resources').find().toArray();
	const reservations = await db.collection<ReservationDocument>('reservations').find().toArray();

	return {
		users,
		resources,
		reservations
	};
}

export const GET: RequestHandler = async () => {
	const db = await connectToDatabase();

	const reservations = await db
		.collection<ReservationDocument>('reservations')
		.find()
		.sort({ createdAt: -1 })
		.toArray();

	return json({
		reservations
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const input = (await request.json()) as CreateReservationInput;

	const currentState = await loadSystemState();

	const [result, updatedState] = runState(createReservation(input), currentState);

	if (result.type === 'invalid') {
		return json(
			{
				success: false,
				errors: result.errors
			},
			{
				status: 400
			}
		);
	}

	const db = await connectToDatabase();

	const updatedResource = updatedState.resources.find((resource) => resource.id === input.resourceId);

	if (!updatedResource) {
		return json(
			{
				success: false,
				errors: ['Updated resource could not be found.']
			},
			{
				status: 500
			}
		);
	}

	await db.collection<ReservationDocument>('reservations').insertOne(result.value);

	await db
		.collection<ResourceDocument>('resources')
		.updateOne({ id: updatedResource.id }, { $set: { timeSlots: updatedResource.timeSlots } });

	return json(
		{
			success: true,
			reservation: result.value
		},
		{
			status: 201
		}
	);
};