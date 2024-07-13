import { AppConfig } from './configuration.interface';

export default (): AppConfig => {
	const { PORT, NODE_ENV, DATABASE_URL, REDIS_URL } = process.env;

	if (!DATABASE_URL) {
		throw new Error(
			'DATABASE_URL must be defined in the environment variables',
		);
	}

	if (!REDIS_URL) {
		throw new Error('REDIS_URL must be defined in the environment variables');
	}

	return {
		PORT: PORT || 3000,
		NODE_ENV: NODE_ENV || 'development',
		DATABASE_URL: DATABASE_URL,
		REDIS_URL: REDIS_URL,
	};
};
