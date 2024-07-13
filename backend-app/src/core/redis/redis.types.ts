export type RedisModuleAsyncOptions = {
	inject: any[];
	useFactory: (...args: any[]) => RedisModuleConfiguration;
};

export type RedisModuleConfiguration = {
	url: string;
};
