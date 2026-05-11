import { Router } from 'express';
import type { Resource } from '../domain/types.js';
import { connectToDatabase } from '../db/mongo.js';

const router = Router();

router.get('/', async (_req, res) => {
	try {
		const db = await connectToDatabase();
		const resources = await db.collection<Resource>('resources').find().toArray();

		res.json({
			resources
		});
	} catch (error) {
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

export default router;