export type RedisModuleAsyncOptions = {
	inject: any[];
	useFactory: (...args: any[]) => RedisModuleConfiguration;
};

export type RedisModuleConfiguration = {
	url: string;
};

export type RedisValue<T> = {
	key: string;
	value: T;
};
