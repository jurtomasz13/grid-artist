import { Module, Global, DynamicModule } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces';
import { RedisService } from './redis.service';
import { RedisModuleAsyncOptions } from './redis.types';

@Global()
@Module({})
export class RedisModule {
	static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
		return {
			module: RedisModule,
			providers: [this.createConfigOptions(options), RedisService],
			exports: [RedisService],
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
