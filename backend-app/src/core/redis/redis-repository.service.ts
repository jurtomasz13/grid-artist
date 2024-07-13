import { Inject, Injectable } from '@nestjs/common';
import { RedisModuleConfiguration } from './redis.types';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepositoryService {
	private readonly redisClient: Redis;

	constructor(
		@Inject('REDIS_MODULE_ASYNC_OPTIONS')
		private readonly options: RedisModuleConfiguration,
	) {
		const { url } = this.options;
		this.redisClient = new Redis(url);
	}

	async setValue(key: string, value: string): Promise<void> {
		await this.redisClient.set(key, value);
	}

	async getValue(key: string): Promise<string | null> {
		return await this.redisClient.get(key);
	}

	async deleteValue(key: string): Promise<number> {
		return await this.redisClient.del(key);
	}

	async closeConnection(): Promise<void> {
		await this.redisClient.quit();
	}
}
