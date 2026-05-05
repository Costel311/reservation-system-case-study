import { json, type RequestHandler } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/db/mongo';
import type { User } from '$lib/domain/types';

export const GET: RequestHandler = async () => {
	const db = await connectToDatabase();

	const users = await db.collection<User>('users').find().toArray();

	return json({
		users
	});
};