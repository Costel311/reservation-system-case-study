import { Router } from 'express';
import type { User } from '../domain/types.js';
import { connectToDatabase } from '../db/mongo.js';

const router = Router();

router.get('/', async (_req, res) => {
	try {
		const db = await connectToDatabase();
		const users = await db.collection<User>('users').find().toArray();

		res.json({
			users
		});
	} catch (error) {
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

export default router;