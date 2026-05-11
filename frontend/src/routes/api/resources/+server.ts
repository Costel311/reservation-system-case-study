import { json, type RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db/mongo';
import type { Resource } from '$lib/domain/types';

export const GET: RequestHandler = async () => {
	const db = await connectToDatabase();

	const resources = await db.collection<Resource>('resources').find().toArray();

	return json({
		resources
	});
};