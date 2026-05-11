import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectToDatabase } from './db/mongo.js';
import usersRouter from './routes/users.js';
import resourcesRouter from './routes/resources.js';
import reservationsRouter from './routes/reservations.js';
import seedRouter from './routes/seed.js';

dotenv.config();

const app = express();

const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
	res.json({
		message: 'Reservation System Backend is running.',
		frontend: 'SvelteKit frontend should run on http://localhost:5173',
		backend: `Express backend is running on http://localhost:${port}`,
		endpoints: {
			users: '/users',
			resources: '/resources',
			reservations: '/reservations',
			seed: '/seed',
			health: '/health'
		}
	});
});

app.get('/health', async (_req, res) => {
	try {
		await connectToDatabase();

		res.json({
			status: 'ok',
			database: 'connected'
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: error instanceof Error ? error.message : 'Unknown database error'
		});
	}
});

app.use('/users', usersRouter);
app.use('/resources', resourcesRouter);
app.use('/reservations', reservationsRouter);
app.use('/seed', seedRouter);

app.listen(port, () => {
	console.log(`Backend server running on http://localhost:${port}`);
});