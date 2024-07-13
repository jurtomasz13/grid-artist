import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '@/core/configuration';
import { RedisModule } from '@/core/redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				url: configService.get<string>('DATABASE_URL'),
				synchronize: true,
			}),
		}),
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				url: configService.get<string>('REDIS_URL'),
			}),
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
