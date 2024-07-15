import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ICellRepositoryService } from './cell/interfaces/cell-repository-service.interface';

@Injectable()
export class GridSyncService {
	constructor(
		@Inject('CellRedisRepositoryService')
		private readonly cellRedisRepositoryService: ICellRepositoryService,
		@Inject('CellTypeORMRepositoryService')
		private readonly cellTypeORMRepositoryService: ICellRepositoryService,
	) {}

	@Cron(CronExpression.EVERY_10_MINUTES)
	async syncPostgresToRedis() {}

	async syncPostgresToRedisAtStartup() {}

	async syncRedisToPostgres() {}
}
