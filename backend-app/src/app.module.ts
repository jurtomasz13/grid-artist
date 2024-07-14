import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '@/core/configuration';
import { RedisModule } from '@/core/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GridModule } from './core/grid/grid.module';
import { AppConfigRootEnum } from './core/configuration/configuration.enum';

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
				url: configService.get<string>(AppConfigRootEnum.DATABASE_URL),
				synchronize: true,
			}),
		}),
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				url: configService.get<string>(AppConfigRootEnum.REDIS_URL),
			}),
		}),
		ScheduleModule.forRoot(),
		GridModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
