import { AppConfig } from './configuration.interface';

export default (): AppConfig => {
	const { PORT, NODE_ENV, DATABASE_URL, REDIS_URL } = process.env;

	checkIfDefined(DATABASE_URL, REDIS_URL);

	return {
		GRID: {
			MAX_CELL_CHANGES: 100,
		},
		PORT: PORT || 3000,
		NODE_ENV: NODE_ENV || 'development',
		DATABASE_URL: DATABASE_URL,
		REDIS_URL: REDIS_URL,
	};
};

function checkIfDefined(DATABASE_URL: string, REDIS_URL: string) {
	if (!DATABASE_URL) {
		throw new Error(
			'DATABASE_URL must be defined in the environment variables',
		);
	}

	if (!REDIS_URL) {
		throw new Error('REDIS_URL must be defined in the environment variables');
	}
}
