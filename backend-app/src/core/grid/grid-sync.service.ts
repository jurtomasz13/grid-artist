import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GridService } from './grid.service';
import { CellRepositoryService } from './cell/cell-repository.service';

@Injectable()
export class GridSyncService {
	constructor(
		private readonly cellRepositoryService: CellRepositoryService,
		private readonly gridService: GridService,
	) {}

	@Cron(CronExpression.EVERY_10_MINUTES)
	async syncPostgresToRedis() {}

	async syncPostgresToRedisAtStartup() {}

	async syncRedisToPostgres() {}
}
