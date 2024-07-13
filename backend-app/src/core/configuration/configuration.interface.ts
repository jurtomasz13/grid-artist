export interface AppConfig {
	PORT: string | number;
	NODE_ENV: string;
	DATABASE_URL: string;
	REDIS_URL: string;
}
