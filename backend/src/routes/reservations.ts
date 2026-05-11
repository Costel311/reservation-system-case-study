import { Router } from 'express';
import type { Reservation, TimeSlot } from '../domain/types.js';
import { connectToDatabase } from '../db/mongo.js';
import { loadStateFromMongo, saveStateToMongo } from '../db/state.js';
import { createReservation } from '../domain/reservation.js';

interface CreateReservationBody {
	userId?: string;
	resourceId?: string;
	slot?: TimeSlot;
}

const router = Router();

router.get('/', async (_req, res) => {
	try {
		const db = await connectToDatabase();

		const reservations = await db
			.collection<Reservation>('reservations')
			.find()
			.sort({ createdAt: -1 })
			.toArray();

		res.json({
			reservations
		});
	} catch (error) {
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

router.post('/', async (req, res) => {
	try {
		const { userId, resourceId, slot } = req.body as CreateReservationBody;

		if (!userId || !resourceId || !slot?.start || !slot?.end) {
			res.status(400).json({
				errors: ['userId, resourceId and slot with start/end are required.']
			});
			return;
		}

		const state = await loadStateFromMongo();

		const [result, newState] = createReservation(userId, resourceId, slot)(state);

		if (!result.ok) {
			res.status(400).json({
				errors: result.errors
			});
			return;
		}

		await saveStateToMongo(newState);

		res.status(201).json(result.value);
	} catch (error) {
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

export default router;