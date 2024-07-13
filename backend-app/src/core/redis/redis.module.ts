import { Module, Global, DynamicModule } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces';
import { RedisRepositoryService } from './redis-repository.service';
import { RedisModuleAsyncOptions } from './redis.types';

@Global()
@Module({})
export class RedisModule {
	static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
		return {
			module: RedisModule,
			providers: [this.createConfigOptions(options), RedisRepositoryService],
			exports: [RedisRepositoryService],
		};
	}

	private static createConfigOptions(
		options: RedisModuleAsyncOptions,
	): Provider {
		return {
			provide: 'REDIS_MODULE_ASYNC_OPTIONS',
			useFactory: options.useFactory,
			inject: options.inject,
		};
	}
}
