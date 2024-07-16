import { Inject, Injectable } from '@nestjs/common';
import { RedisModuleConfiguration, RedisValue } from './redis.types';
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

	async setValue<T>(key: string, value: T): Promise<void> {
		await this.redisClient.set(key, JSON.stringify(value));
	}

	async batchSetValue<T>(data: RedisValue<T>[]): Promise<void> {
		const pipeline = this.redisClient.pipeline();
		data.forEach(({ key, value }) => {
			pipeline.set(key, JSON.stringify(value));
		});
		await pipeline.exec();
	}

	async getValue(key: string): Promise<string | null> {
		return await this.redisClient.get(key);
	}

	async getAllValues(pattern: string): Promise<string[] | null> {
		let cursor = '0';
		let keys: string[] = [];

		do {
			const result = await this.redisClient.scan(cursor, 'MATCH', pattern);
			cursor = result[0];
			keys.push(...result[1]);
		} while (cursor !== '0');

		const values = await Promise.all(
			keys.map((key) => this.redisClient.get(key)),
		);

		return values.filter((value) => value !== null);
	}

	async deleteValue(key: string): Promise<number> {
		return await this.redisClient.del(key);
	}

	async closeConnection(): Promise<void> {
		await this.redisClient.quit();
	}

	async clearDb(): Promise<void> {
		await this.redisClient.flushdb();
	}
}
